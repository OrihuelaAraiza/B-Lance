import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function beginAcademic(page: Page) {
  await page.getByRole("button", { name: /La escuela me pesa/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("button", { name: "Explorar el recorrido", exact: true }),
  ).toBeDisabled();
  await dialog.getByRole("checkbox").check();
  await dialog
    .getByRole("button", { name: "Explorar el recorrido", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Omitir datos de contexto" })
    .click();
  await dialog
    .getByLabel("Ejemplo de cómo ha ido el semestre (opcional)")
    .fill("Ejemplo ficticio: tareas y exámenes.");
  await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
  return dialog;
}

async function offerAcademic(page: Page) {
  const dialog = await beginAcademic(page);
  await dialog
    .getByRole("button", { name: "Estoy a salvo, quiero continuar" })
    .click();
  return dialog;
}

test("feedback sections, brand, help resources and WhatsApp remain coherent", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByAltText("Nabi, la mariposa y mascota de B-lance"),
  ).toBeVisible();
  for (const id of [
    "jovenes",
    "como-funciona",
    "instituciones",
    "zona-segura",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.locator(`#${id}`).getByRole("heading", { level: 2 }).first(),
    ).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${id}.png`) });
  }
  await page.locator(".support-signs summary").click();
  await expect(page.locator(".support-signs")).toContainText(
    "descansar, concentrarte",
  );
  await page.locator("#zona-segura").scrollIntoViewIfNeeded();
  const safe = page.locator("#zona-segura");
  await expect(
    safe.getByRole("link", { name: /800 911 2000/ }),
  ).toHaveAttribute("href", "tel:8009112000");
  await expect(safe.getByRole("link", { name: /^911/ })).toHaveAttribute(
    "href",
    "tel:911",
  );
  await safe.locator("summary").first().click();
  await expect(safe).toContainText("Solo se prepara un saludo genérico");
  const links = page.locator('a[href^="https://wa.me/"]');
  expect(await links.count()).toBeGreaterThanOrEqual(4);
  for (const link of await links.all()) {
    const target = new URL((await link.getAttribute("href"))!);
    expect(target.pathname).toBe("/525667769449");
    expect(target.searchParams.get("text")).toBe(
      "Hola, quiero conocer el apoyo de B-lance.",
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  // Verify the click opens the configured external destination without contacting anyone.
  await page
    .context()
    .route("https://wa.me/**", (route) =>
      route.fulfill({
        body: "WhatsApp destination intercepted for local verification",
      }),
    );
  const popupPromise = page.waitForEvent("popup");
  await safe.getByRole("link", { name: "Abrir chat en WhatsApp" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(new URL(popup.url()).pathname).toBe("/525667769449");
  await popup.close();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("academic journey respects opt-out, negative filter, safety and clean exit", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  let dialog = await offerAcademic(page);
  await dialog
    .getByRole("button", { name: "Ahora no, prefiero ver recursos" })
    .click();
  await expect(dialog).toContainText("No calculamos una puntuación");
  await expect(dialog.getByText("Ver resumen descriptivo")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Terminar y borrar" }).click();
  dialog = await offerAcademic(page);
  await dialog.getByRole("button", { name: "Sí, quiero responder" }).click();
  await dialog.getByRole("button", { name: "No", exact: true }).click();
  await expect(dialog).toContainText(
    "No se calcula una puntuación ni se concluye que no necesites apoyo",
  );
  await dialog.getByRole("button", { name: "Terminar y borrar" }).click();
  dialog = await beginAcademic(page);
  await dialog
    .getByRole("button", { name: "Necesito ayuda o no estoy seguro/a" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Tu seguridad va primero." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Llamar al 911" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar opciones de ayuda" }).click();
  await page.getByRole("button", { name: /La escuela me pesa/ }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
});

test("21-item journey validates arithmetic, pause, back, focus and privacy", async ({
  page,
  context,
}, testInfo) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.assign(window, { storageWrites: [] });
    Storage.prototype.setItem = function () {
      (window as unknown as { storageWrites: string[] }).storageWrites.push(
        "storage",
      );
    };
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (...args) {
      (window as unknown as { storageWrites: string[] }).storageWrites.push(
        "indexedDB",
      );
      return open.apply(this, args);
    };
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  page.on("request", (request) => requests.push(request.url()));
  const dialog = await offerAcademic(page);
  await dialog.getByRole("button", { name: "Sí, quiero responder" }).click();
  await dialog.getByRole("button", { name: "Sí", exact: true }).click();
  await dialog.getByRole("button", { name: "4", exact: true }).click();
  await expect(dialog.getByRole("heading")).toBeFocused();
  const firstQuestion = await dialog.getByRole("heading").textContent();
  await dialog.getByRole("button", { name: "Pausar recorrido" }).click();
  await expect(dialog.getByRole("heading")).toHaveText(
    "Puedes tomar tu tiempo.",
  );
  await dialog.getByRole("button", { name: "Continuar donde estaba" }).click();
  await expect(dialog.getByRole("heading")).toHaveText(firstQuestion!);
  await dialog.getByRole("button", { name: "Siempre", exact: true }).click();
  await dialog
    .getByRole("button", { name: "Volver a la pregunta anterior" })
    .click();
  await expect(dialog.getByRole("heading")).toHaveText(firstQuestion!);
  const questionAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(questionAudit.violations).toEqual([]);
  for (let i = 0; i < 21; i++) {
    await expect(
      dialog.getByRole("button", { name: "Ayuda ahora", exact: true }),
    ).toBeVisible();
    await dialog
      .getByRole("button", {
        name: i < 7 ? "Nunca" : i < 14 ? "Raras veces" : "Siempre",
        exact: true,
      })
      .click();
  }
  await expect(dialog.getByRole("heading")).toHaveText(
    "Gracias por completar el recorrido.",
  );
  await dialog.locator(".academic-summary summary").click();
  await expect(dialog.locator("dd")).toHaveText([
    "0.00",
    "2.00",
    "5.00",
    "4 / 5",
  ]);
  await expect(dialog).toContainText("sin clasificación clínica");
  const resultAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(resultAudit.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("academic-result.png") });
  expect(requests).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      writes: (window as unknown as { storageWrites: string[] }).storageWrites,
    })),
  ).toEqual({ local: 0, session: 0, writes: [] });
  expect(errors).toEqual([]);
  await dialog.getByRole("button", { name: "Terminar y borrar" }).click();
  await expect(
    page.getByRole("button", { name: /La escuela me pesa/ }),
  ).toBeFocused();
});
