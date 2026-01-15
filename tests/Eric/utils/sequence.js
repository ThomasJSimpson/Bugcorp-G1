// utils/sequence.js
/**
 * Séquence d'amorçage des 4 boutons
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
    const btn = page.locator(id);

    // attendre que l'overlay n'intercepte plus les clics
    /*  await page.waitForFunction(() => {
      const el = document.querySelector(".relative.overflow-hidden");
      return !el || getComputedStyle(el).pointerEvents !== "auto";
    });*/

    // attendre que le bouton soit visible
    await btn.waitFor({ state: "visible" });

    // laisser finir les transitions CSS
    await page.waitForTimeout(100);

    // clic utilisateur réel
    await btn.click();
  }
}
