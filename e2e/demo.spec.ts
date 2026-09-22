import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function begin(page: Page) {
  await page.getByRole("button", { name: "Hacer mi check-in", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Empezar mi check-in" })).toBeDisabled();
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Empezar mi check-in" }).click();
  await expect(dialog.getByRole("heading")).toBeFocused();
  return dialog;
}

async function assertAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
}

test("layout, keyboard navigation, selected states and accessible data", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const headingBox = await page.getByRole("heading", { level: 1 }).boundingBox();
  const headerBox = await page.locator(".site-header").boundingBox();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 16);
  const help = page.locator(".site-header").getByRole("button", { name: "Ayuda ahora" });
  await expect(help).toBeInViewport();
  if (page.viewportSize()!.width <= 1020) {
    const menu = page.getByRole("button", { name: "Abrir menú" });
    await menu.focus(); await page.keyboard.press("Enter"); await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Para jóvenes", exact: true })).toBeFocused();
    await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
    await page.getByRole("button", { name: "Abrir menú" }).click();
  }
  await page.getByRole("link", { name: "Para profesionales", exact: true }).click();
  await expect(page.locator("#instituciones")).toBeFocused();
  await page.getByRole("button", { name: "Tendencia", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tendencia", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("table")).toContainText("Semana 4");
  await expect(page.getByRole("table")).toContainText("58");
  await assertAccessible(page);
  await page.getByRole("button", { name: "Una relación", exact: true }).click();
  await expect(page.getByRole("button", { name: "Una relación", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: testInfo.outputPath("page.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("check-in routes, modal transitions and no transmitted or persisted responses", async ({ page, context }) => {
  const requests: string[] = [];
  await page.addInitScript(() => {
    const audit: string[] = [];
    Object.assign(window, { demoStorageWrites: audit });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) { audit.push("storage"); return original.call(this, key, value); };
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (...args) { audit.push("indexedDB"); return open.apply(this, args); };
    const cookie = Object.getOwnPropertyDescriptor(Document.prototype, "cookie")!;
    Object.defineProperty(document, "cookie", { get: () => cookie.get!.call(document), set: (value) => { audit.push("cookie"); cookie.set!.call(document, value); } });
  });
  await page.goto("/"); await page.waitForLoadState("networkidle");
  page.on("request", (request) => requests.push(`${request.method()} ${request.url()}`));
  let dialog = await begin(page);
  await dialog.getByRole("button", { name: "Sí, necesito ayuda ahora", exact: true }).click();
  await expect(dialog.getByRole("link", { name: "Llamar al 911" })).toHaveAttribute("href", "tel:911");
  await dialog.getByRole("button", { name: "Ver todas las opciones de ayuda" }).click();
  await expect(page.getByRole("dialog", { name: "Tu seguridad va primero." })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar opciones de ayuda" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  for (const high of [false, true]) {
    dialog = await begin(page);
    await dialog.getByRole("button", { name: "No, estoy a salvo" }).click();
    await dialog.getByRole("button", { name: high ? /Es demasiado/ : /Casi nada/ }).click();
    await dialog.getByRole("button", { name: high ? /Por completo/ : /^Poco/ }).click();
    await dialog.getByRole("button", { name: "Me ha pasado, pero no ahora" }).click();
    await dialog.getByRole("button", { name: "Sí, sé con quién" }).click();
    await expect(dialog.getByRole("heading")).toHaveText("Esto merece apoyo humano hoy.");
    await expect(dialog.getByRole("button", { name: "Ver opciones de apoyo" })).toBeVisible();
    await dialog.getByRole("button", { name: "Hacer una pausa guiada" }).click();
    await expect(page.getByRole("dialog", { name: "Solo sigue el ritmo." })).toBeVisible();
    await page.getByRole("button", { name: "Cerrar pausa guiada" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  expect(requests).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, writes: (window as unknown as { demoStorageWrites: string[] }).demoStorageWrites }))).toEqual({ local: 0, session: 0, writes: [] });
});

test("dialogs pass accessibility checks and keyboard focus stays inside", async ({ page }, testInfo) => {
  await page.goto("/"); await page.waitForLoadState("networkidle");
  const dialog = await begin(page);
  await assertAccessible(page);
  await dialog.getByRole("button", { name: "Ayuda ahora", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Tu seguridad va primero." })).toBeVisible();
  await page.waitForTimeout(400); // Radix exit animation before auditing the next dialog.
  await assertAccessible(page);
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Tomar una pausa", exact: true }).click();
  await page.waitForTimeout(400);
  await assertAccessible(page);
  await page.screenshot({ path: testInfo.outputPath("breathing.png") });
});

test("breathing clock completes, repeats and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "Tomar una pausa", exact: true }).click();
  await page.getByRole("button", { name: "Empezar", exact: true }).click();
  await page.clock.runFor(4000);
  await expect(page.getByRole("dialog").getByRole("status")).toHaveText("Suelta. Sin prisa, por la boca.");
  await page.getByRole("button", { name: "Pausar", exact: true }).click();
  const clock = await page.locator(".breathing-controls > span").textContent();
  await page.clock.runFor(8000);
  await expect(page.locator(".breathing-controls > span")).toHaveText(clock!);
  await expect(page.locator(".breath-orbit__halo")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.clock.runFor(46000);
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Pausa terminada");
  await page.getByRole("button", { name: "Repetir la pausa" }).click();
  await expect(page.locator(".breathing-controls > span")).toHaveText("0 / 50 s");
});


test("closing and immediately reopening restores focus and starts a clean session", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Hacer mi check-in", exact: true }).first();
  const dialog = await begin(page);
  await dialog.getByRole("button", { name: "No, estoy a salvo" }).click();
  await dialog.getByRole("button", { name: "Cerrar check-in", exact: true }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Empezar mi check-in" }).click();
  await page.waitForTimeout(300);
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("¿Estás en peligro ahora o alguien puede lastimarte?");
});
