// @ts-check
import { test, expect } from "@playwright/test";
//pré-conditions connexion zone sécurisée
test('précondition accès la la page "Zone sécurisée"', async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
  await page.getByTestId("nav-secure").click();

  // Test Non Passant de la connexion au panneau de contrôle de l’onglet “Zone sécurisée”
  await page.getByRole("textbox", { name: "Identifiant" }).click();
  await page.getByRole("textbox", { name: "Identifiant" }).fill("@dmin1");
  await page.getByRole("textbox", { name: "Mot de passe" }).click();
  await page
    .getByRole("textbox", { name: "Mot de passe" })
    .fill("password1234");
  await page.getByRole("button", { name: "Déverrouiller" }).click();

  //Test login success

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
