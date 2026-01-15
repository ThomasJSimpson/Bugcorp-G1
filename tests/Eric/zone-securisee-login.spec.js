import { test, expect } from "@playwright/test";

test.describe("Zone sécurisée – cas NON passants login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-secure").click();
  });

  test("champs vides", async ({ page }) => {
    await page.getByRole("button", { name: "Déverrouiller" }).click();
    await expect(
      page.getByRole("heading", { name: /Zone Sécurisée/i })
    ).not.toBeVisible();
  });

  test("identifiant vide", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Mot de passe" })
      .fill("password123");
    await page.getByRole("button", { name: "Déverrouiller" }).click();

    await expect(
      page.getByRole("heading", { name: /Zone Sécurisée/i })
    ).not.toBeVisible();
  });

  test("mot de passe vide", async ({ page }) => {
    await page.getByRole("textbox", { name: "Identifiant" }).fill("admin");
    await page.getByRole("button", { name: "Déverrouiller" }).click();

    await expect(
      page.getByRole("heading", { name: /Zone Sécurisée/i })
    ).not.toBeVisible();
  });

  test("1 seul caractère", async ({ page }) => {
    await page.getByRole("textbox", { name: "Identifiant" }).fill("a");
    await page.getByRole("textbox", { name: "Mot de passe" }).fill("b");
    await page.getByRole("button", { name: "Déverrouiller" }).click();

    await expect(
      page.getByRole("heading", { name: /Zone Sécurisée/i })
    ).not.toBeVisible();
  });

  test("caractères spéciaux", async ({ page }) => {
    await page.getByRole("textbox", { name: "Identifiant" }).fill("!!@@##");
    await page.getByRole("textbox", { name: "Mot de passe" }).fill("$$%%^^");
    await page.getByRole("button", { name: "Déverrouiller" }).click();

    await expect(
      page.getByRole("heading", { name: /Zone Sécurisée/i })
    ).not.toBeVisible();
  });
});
