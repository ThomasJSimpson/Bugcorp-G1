import { test, expect } from "@playwright/test";

export async function goToAnnuaire(page) {
  await page.goto("https://bugcorp.vercel.app/");
  await expect(page.getByRole("heading", { name: "Bienvenue chez BugCorp" })).toBeVisible();
  await page.getByRole("button", { name: "Accéder à l'Annuaire" }).click();
  await expect(page.getByRole("heading", { name: "L'Annuaire Enterprise" })).toBeVisible();
}

export function stringToNb(string) {
  return parseInt(string.replace(/[^\d-]/g, ""), 10);
}

async function getLegendRoles(page) {
  await page.getByTestId("legend-btn").click();
  await expect(page.getByRole("heading", { name: "Hiérarchie des Rôles" })).toBeVisible();
  const roles = await page.locator('[id^="list-item-role-"] h4').allInnerTexts();
  await page.getByTestId("modal-confirm-btn").click();
  return roles;
}

async function getTargetSavings(page) {
  const targetValueTxt = await page.locator("#target-savings-value").innerText();
  const targetValue = stringToNb(targetValueTxt);
  console.log(targetValue);
  return targetValue;
}

async function getLegendSavings(page) {
  const rawTexts = await page.locator("#legend-savings > span").allInnerTexts();
  const savingsData = {};

  for (const text of rawTexts) {
    const [label, rawValue] = text.split(":");
    // label = "Promouvoir"
    // rawValue = " -15 000 €"

    // Nettoyage
    const key = label.trim().toLowerCase();
    const numberValue = stringToNb(rawValue);

    savingsData[key] = {
      originalString: rawValue.trim(), // "-15 000 €" string
      numberValue: numberValue, // -15000 number
    };
  }
  console.log(savingsData);
  return savingsData;
}

export async function getCurrentSavings(page) {
  const currentSavingsTxt = await page.locator("#current-savings-value").innerText();
  const currentSavings = stringToNb(currentSavingsTxt);
  return currentSavings;
}

export async function getData(page) {
  const legendSavings = await getLegendSavings(page);
  const targetSavings = await getTargetSavings(page);
  const currentSavings = await getCurrentSavings(page);
  const legendRoles = await getLegendRoles(page);
  const data = { legendRoles: legendRoles, legendSavings: legendSavings, savings: { currentSavings: currentSavings, targetSavings: targetSavings } };
  console.log(data);
  return data;
}
export function checkNextRole(titleAction, currentRole, legendRoles) {
  let nextRole = "";
  if (titleAction === "promouvoir") {
    if (legendRoles.indexOf(currentRole) === legendRoles.length - 1) {
      nextRole = currentRole;
    } else {
      nextRole = legendRoles[legendRoles.indexOf(currentRole) + 1];
    }
  } else if (titleAction === "rétrograder") {
    if (legendRoles.indexOf(currentRole) === 0) {
      nextRole = currentRole;
    } else {
      nextRole = legendRoles[legendRoles.indexOf(currentRole) - 1];
    }
  } else {
    throw new Error(`Titre inattendu : ${titleAction}`);
  }
  return nextRole;
}

export async function getNameRolesUI(page) {
  const allName = await page.locator('[id^="cell-name-"]').allInnerTexts();
  const allRoles = await page.locator('[id^="cell-role-"]').allInnerTexts();

  const allRolesNames = allName.reduce((acc, nom, i) => {
    acc[nom] = allRoles[i];
    return acc;
  }, {});
  return allRolesNames;
}
export function isDescending(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) {
      return false;
    }
  }
  return true;
}

export async function getCellsBugs(page) {
  let cellsBugs = await page.locator('[id^="cell-bugs-"]').allInnerTexts();
  const cellsBugsNb = cellsBugs.map(stringToNb);
  return cellsBugsNb;
}
export async function deleteSteps(page) {
  await page.locator("#btn-confirm-step1").click();
  await expect(page.getByRole("heading", { name: "Ils ont des familles" })).toBeVisible();
  await page.locator("#btn-confirm-step2").click();
  await expect(page.getByRole("heading", { name: "Confirmation Ultime" })).toBeVisible();
  await page.locator("#input-confirm-delete").fill("DELETE");
  await page.locator("#btn-confirm-delete").click();
  await expect(page.locator("#goal-reached-badge")).toContainText("Objectif Atteint");
}
