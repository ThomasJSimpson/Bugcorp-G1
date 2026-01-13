// @ts-check
import { test, expect } from "@playwright/test";

//pré-conditions connexion zone sécurisée
test('précondition accès la la page "Zone sécurisée"', async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
  await page.getByTestId("nav-secure").click();

  // Test NP login page "Zone sécurisée" identifiant
  await page.getByRole("textbox", { name: "Identifiant" }).fill("@dmin1");
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("password123");
  await page.getByRole("button", { name: "Déverrouiller" }).click();

  //Test NP login page "Zone sécurisée" password
  await page.getByRole("textbox", { name: "Identifiant" }).fill("admin");
  await page
    .getByRole("textbox", { name: "Mot de passe" })
    .fill("p@ssword1234");
  await page.getByRole("button", { name: "Déverrouiller" }).click();

  //Test login success
  await page.getByRole("textbox", { name: "Identifiant" }).fill("admin");
  await page.getByRole("textbox", { name: "Mot de passe" }).fill("password123");
  await page.getByRole("button", { name: "Déverrouiller" }).click();
  await page
    .getByRole("heading", { name: "Zone Sécurisée (Niveau 4)" })
    .click();
  //Test du bouton "Détruire"
  test("bouton Déverrouiller désactivé au chargement", async ({ page }) => {
    const boutonDestroy = page.locator("#btn-danger-destroy");

    // Vérifie UNE SEULE FOIS
    //await expect(button).toBeDisabled();
  });
});

test("get started link", async ({ page }) => {});
