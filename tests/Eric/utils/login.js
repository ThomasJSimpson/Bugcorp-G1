// @ts-check
/**
 * Fonction réutilisable pour se connecter à la zone sécurisée
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
export async function loginZoneSecure(page, username, password) {
  await page.getByRole("textbox", { name: "Identifiant" }).fill(username);
  await page.getByRole("textbox", { name: "Mot de passe" }).fill(password);
  await page.getByRole("button", { name: "Déverrouiller" }).click();
}
