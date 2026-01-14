import { test, expect } from "@playwright/test";

export async function goToAnnuaire(page) {
  await page.goto("https://bugcorp.vercel.app/");
  await expect(page.getByRole("heading", { name: "Bienvenue chez BugCorp" })).toBeVisible();
  await page.getByRole("button", { name: "Accéder à l'Annuaire" }).click();
  await expect(page.getByRole("heading", { name: "L'Annuaire Enterprise" })).toBeVisible();
}

function stringToNb(string) {
  return parseInt(string.replace(/[^\d-]/g, ""), 10);
}
async function getLegendRoles(page) {
  await page.getByTestId("legend-btn").click();
  await expect(page.getByRole("heading", { name: "Hiérarchie des Rôles" })).toBeVisible();
  const roles = await page.locator('[id^="list-item-role-"] h4').allInnerTexts();
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
    const numberValue = stringToNb(rawValue);
    const key = label.trim().toLowerCase();

    savingsData[key] = {
      originalString: rawValue.trim(), // "-15 000 €"
      numberValue: numberValue, // -15000
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
  const legendRoles = await getLegendRoles(page);
  const legendSavings = await getLegendSavings(page);
  const targetSavings = await getTargetSavings(page);
  const currentSavings = await getCurrentSavings(page);
  const data = { legendRoles: legendRoles, legendSavings: legendSavings, savings: { currentSavings: currentSavings, targetSavings: targetSavings } };
  console.log(data);
  return data;
}
