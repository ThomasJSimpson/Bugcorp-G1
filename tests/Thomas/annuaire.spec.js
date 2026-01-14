// @ts-check
import { test, expect } from "@playwright/test";
import { goToAnnuaire, getData } from "./utils/functions.js";

test('[US01] - Parcours "Promotion" : Recherche + filtre + promotion', async ({ page }) => {
  await goToAnnuaire(page);

  const data = await getData(page); // return un objet;
  console.log(data);

  await page.getByTestId("search-input").fill("Jean");
  // Localise tous les élements avec leur id commençant par "cell-name-" et on stock dans un tableau

  // On extrait tous les textes d'un coup
  const names = await page.locator('[id^="cell-name-"]').allInnerTexts();
  // names = ["Jean Bon", "Jean Neymar"]
  for (const name of names) {
    expect(name).toContain("Jean");
  }

  await page.getByTestId("dept-filter").selectOption("RH");

  const departs = await page.locator('[id^="cell-dept-"]').allInnerTexts();
  for (const depart of departs) {
    expect(depart).toContain("RH");
  }
});
