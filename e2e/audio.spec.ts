import { expect, test } from "@playwright/test";

test("sound button plays the local audio, loops, stops and resumes", async ({ page }) => {
  const errors: string[] = [];
  const mediaRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("request", (request) => { if (request.resourceType() === "media") mediaRequests.push(request.url()); });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const audio = page.locator("audio");
  expect(mediaRequests).toEqual([]);
  expect(await audio.evaluate((element) => element.paused)).toBe(true);
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sonido activado", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeGreaterThan(0.2);
  expect(await audio.evaluate((element) => ({ paused: element.paused, muted: element.muted, volume: element.volume, duration: element.duration }))).toMatchObject({ paused: false, muted: false, volume: 1, duration: 40 });
  expect(mediaRequests.length).toBeGreaterThan(0);
  expect(mediaRequests.every((url) => url.endsWith("/audio/ambiente-suave.mp3"))).toBe(true);

  // Decode the real media through Web Audio and measure a non-silent signal.
  expect(await audio.evaluate(async (element) => {
    const context = new AudioContext();
    const source = context.createMediaElementSource(element);
    const analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    await context.resume();
    const samples = new Float32Array(analyser.fftSize);
    let peak = 0;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      analyser.getFloatTimeDomainData(samples);
      peak = Math.max(peak, ...samples.map(Math.abs));
    }
    // Keep the media connected for the remainder of the playback checks.
    Object.assign(window, { audioTestContext: context });
    return peak;
  })).toBeGreaterThan(0.001);

  await audio.evaluate((element) => { element.currentTime = element.duration - 0.2; });
  await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeLessThan(2);
  await page.getByRole("button", { name: "Sonido activado", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sonido desactivado", exact: true })).toHaveAttribute("aria-pressed", "false");
  expect(await audio.evaluate((element) => element.paused)).toBe(true);
  const pausedAt = await audio.evaluate((element) => element.currentTime);
  await page.waitForTimeout(250);
  expect(await audio.evaluate((element) => element.currentTime)).toBe(pausedAt);
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeGreaterThan(pausedAt);
  expect(errors).toEqual([]);
});

test("audio download failure leaves sound off and supports retry", async ({ page }) => {
  await page.route("**/audio/ambiente-suave.mp3", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await expect(page.locator("#sound-error")).toContainText("No se pudo reproducir el sonido");
  await expect(page.getByRole("button", { name: "Sonido desactivado", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.unroute("**/audio/ambiente-suave.mp3");
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sonido activado", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#sound-error")).toHaveCount(0);
});

test("pending playback can be cancelled without turning sound back on", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/audio/ambiente-suave.mp3", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await page.getByRole("button", { name: "Cargando sonido", exact: true }).click();
  release();
  await expect(page.getByRole("button", { name: "Sonido desactivado", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(300);
  expect(await page.locator("audio").evaluate((element) => element.paused)).toBe(true);
  await expect(page.locator("#sound-error")).toHaveCount(0);
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sonido activado", exact: true })).toHaveAttribute("aria-pressed", "true");
});
