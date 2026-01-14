// @ts-check
/**
 * Fonction pour exécuter la séquence d'amorçage des 4 boutons
 * @param {import('@playwright/test').Page} page
 */
export async function runSequence(page) {
  const btns = [
    "#btn-switch-0",
    "#btn-switch-1",
    "#btn-switch-2",
    "#btn-switch-3",
  ];
  for (const id of btns) {
    await page.locator(id).click();
  }
}
