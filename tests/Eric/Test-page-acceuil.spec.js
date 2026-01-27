import { test, expect } from "@playwright/test";

test.describe("Test du lien page d'acceuil", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("test", async ({ page }) => {
    await page.getByTestId("nav-directory").click();
    await page.getByRole("heading", { name: "L'Annuaire Enterprise" }).click();
    await page.getByTestId("nav-home").click();
    await page.getByRole("button", { name: "Pirater le Système" }).click();
    await page.getByRole("heading", { name: "Accès Restreint" }).click();
  });
});
