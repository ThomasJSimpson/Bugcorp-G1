import { test, expect } from "@playwright/test";
import { goToAnnuaire, getData, checkNextRole, getCurrentSavings, getNameRolesUI, stringToNb, isDescending, getCellsBugs, deleteSteps } from "./utils/functions.js";

test('[US01] - Parcours "Promotion" : Recherche + filtre + promotion', async ({ page }) => {
  await goToAnnuaire(page);

  const data = await getData(page); // return un objet;
  console.log(data);

  await page.getByTestId("search-input").fill("Jean");

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
  const currentRole = await page.locator("#cell-role-1005").innerText();
  let titleAction = await page.getByTestId("promote-btn-1005").getAttribute("title");
  const currentSavings = data.savings.currentSavings;
  let nextCurrentSavings = 0;
  if (titleAction) {
    titleAction = titleAction.toLowerCase();
    nextCurrentSavings = currentSavings + data.legendSavings[titleAction].numberValue;
  }
  const nextRole = checkNextRole(titleAction, currentRole, data.legendRoles);
  console.log(currentRole, nextRole);

  await page.getByTestId("promote-btn-1005").click();

  //Vérif nex role + budjet
  await expect(page.locator("#cell-role-1005")).toHaveText(nextRole);
  const actualValue = await getCurrentSavings(page);
  expect(actualValue).toBe(nextCurrentSavings);
});

test('[US02] - Parcours "Rétrogradation" : filtres + tri  + sélection multiple + rétrogradation', async ({ page }) => {
  await goToAnnuaire(page);
  const data = await getData(page);
  await page.getByTestId("dept-filter").selectOption("Juridique");
  const departs = await page.locator('[id^="cell-dept-"]').allInnerTexts();
  for (const depart of departs) {
    expect(depart).toContain("Juridique");
  }
  await page.getByTestId("status-filter").selectOption("Absent");
  const allStatus = await page.locator('[id^="cell-status-"]').allInnerTexts();
  console.log(allStatus);
  for (const status of allStatus) {
    expect(status).toContain("Absent");
  }

  let currentRolesNames = await getNameRolesUI(page);
  console.log(currentRolesNames);

  let accCurrentSavings = data.savings.currentSavings;

  const allCheckboxes = await page.locator('[id^="checkbox-"]:not([id="checkbox-select-all"])').all();

  // On boucle dessus pour les cocher une par une
  for (const checkbox of allCheckboxes) {
    await checkbox.check();
  }

  let titleAction = await page.locator("#btn-bulk-demote").innerText();
  // let titleAction = await page.locator("#btn-bulk-promote").innerText();

  console.log(titleAction);
  if (titleAction) {
    titleAction = titleAction.toLowerCase().trim();
  }
  console.log(titleAction);

  await page.locator("#btn-bulk-demote").click();

  let newRolesNames = await getNameRolesUI(page);
  console.log(newRolesNames);
  let roleChangesNumber = 0;
  for (const nom in currentRolesNames) {
    const exRole = currentRolesNames[nom];
    const expectedRole = checkNextRole(titleAction, exRole, data.legendRoles);
    const currentRole = newRolesNames[nom];

    // Cas limite : Si l'employé était déjà au min/max
    if (exRole === expectedRole) {
      console.log(`${nom} était déjà au grade limite (${exRole}). Aucun changement attendu.`);
    } else {
      accCurrentSavings += data.legendSavings[titleAction].numberValue;
      roleChangesNumber++;
    }
    // Vérification
    expect(currentRole).toBe(expectedRole);
  }
  const expectedCurrentSavings = roleChangesNumber * data.legendSavings[titleAction].numberValue;
  expect(accCurrentSavings).toBe(expectedCurrentSavings);
  console.log(accCurrentSavings, expectedCurrentSavings);
});

test('[US03] - Parcours "Licenciement" : filtre + tri + sélection multiple + licenciement.', async ({ page }) => {
  await goToAnnuaire(page);
  const data = await getData(page);
  await page.getByTestId("status-filter").selectOption("Sur la sellette");
  const allStatus = await page.locator('[id^="cell-status-"]').allInnerTexts();
  console.log(allStatus);
  for (const status of allStatus) {
    expect(status).toContain("Sur la sellette");
  }

  // Tentative de tri "Descendant"
  let cellsBugsNb = await getCellsBugs(page);

  while (!isDescending(cellsBugsNb)) {
    await page.getByTestId("header-bugs").click();
    cellsBugsNb = await getCellsBugs(page);
  }
  console.log("c bon c'est trié!");

  const targetSavings = data.savings.targetSavings;
  const firedValue = data.legendSavings["virer"].numberValue;
  let nbToFired = Math.ceil(targetSavings / firedValue);
  console.log(targetSavings);
  console.log(firedValue);
  console.log(nbToFired);
  nbToFired > 10 && (await page.getByTestId("items-per-page").selectOption("20"));
  const allCheckboxes = await page.locator('[id^="checkbox-"]:not([id="checkbox-select-all"])').all();
  console.log(allCheckboxes);
  for (let i = 0; i < nbToFired; i++) {
    await allCheckboxes[i].check();
  }
  await page.locator("#btn-bulk-fire").click();
  await deleteSteps(page);
});
