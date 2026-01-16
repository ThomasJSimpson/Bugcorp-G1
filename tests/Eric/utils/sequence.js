// utils/sequence.js
/**
 * Exécute une séquence d'amorçage selon l'ordre fourni
 * @param {import('@playwright/test').Page} page
 * @param {number[]} order ex: [0,1,3] ou [0,1,2,3]
 */
export async function runSequence(page, order) {
  for (const index of order) {
    const btn = page.locator(`#btn-switch-${index}`);

    // Playwright attend visibilité + stabilité + cliquabilité
    await btn.waitFor({ state: "visible" });
    await btn.click();
  }
}
