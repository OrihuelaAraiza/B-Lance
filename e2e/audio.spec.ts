import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { sounds } from "../src/data/sounds";

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

test("all six environments play through one player and selection respects silence", async ({ page }, testInfo) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (request.resourceType() === "media") requests.push(request.url()); });
  await page.goto("/");
  const picker = page.getByLabel("Elegir ambiente relajante");
  await picker.click();
  await expect(page.getByRole("group", { name: "Tu ambiente" })).toBeVisible();
  await page.getByRole("radio", { name: /Lluvia ligera/ }).check();
  await expect(page.getByRole("radio", { name: /Lluvia ligera/ })).toBeChecked();
  await expect(page.getByRole("button", { name: "Sonido desactivado", exact: true })).toHaveAttribute("aria-pressed", "false");
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const panel = await page.locator(".sound-picker__panel").boundingBox();
  expect(panel!.x).toBeGreaterThanOrEqual(0);
  expect(panel!.x + panel!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await expect(page.locator(".pulse-card")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: testInfo.outputPath("sound-picker.png") });
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(picker).toBeFocused();
  await expect(page.getByRole("group", { name: "Tu ambiente" })).not.toBeVisible();
  await page.getByRole("button", { name: "Sonido desactivado", exact: true }).click();
  const audio = page.locator("audio");
  for (const sound of sounds) {
    await picker.click();
    await page.getByRole("radio", { name: new RegExp(sound.name) }).check();
    await expect(page.getByRole("button", { name: "Sonido activado", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(audio).toHaveAttribute("src", `/audio/${sound.id}.mp3`);
    await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeGreaterThan(0.1);
    expect(await audio.evaluate((element) => element.duration)).toBeGreaterThan(39);
    await expect(audio).toHaveCount(1);
    await audio.evaluate((element) => { element.currentTime = element.duration - 0.15; });
    await expect.poll(() => audio.evaluate((element) => element.currentTime)).toBeLessThan(2);
    await page.keyboard.press("Escape");
  }
  await page.getByRole("button", { name: "Sonido activado", exact: true }).click();
  await picker.click();
  await page.getByRole("radio", { name: /Ruido marrón/ }).check();
  expect(await audio.evaluate((element) => element.paused)).toBe(true);
  await page.getByRole("link", { name: "B Lance by ROMI, ir al inicio" }).first().click();
  await expect(page.getByRole("group", { name: "Tu ambiente" })).not.toBeVisible();
  expect(errors).toEqual([]);
});
