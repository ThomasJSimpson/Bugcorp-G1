import { test, expect } from "@playwright/test";
import { loginZoneSecure } from "./utils/login.js";
import { runSequence } from "./utils/sequence.js";

import dotenv from "dotenv";

dotenv.config();

const USER = process.env.LOGIN_USER;
const PASS = process.env.LOGIN_PASS;

test.describe("Zone sécurisée E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-secure").click();
    await loginZoneSecure(page, USER, PASS);
  });

  test("séquence + slider + destruction + hard reboot", async ({ page }) => {
    // --- LOCATORS ---
    const destroyBtn = page.locator("#btn-danger-destroy");
    const slider = page.locator("#input-slider-power");
    const sliderValue = page.locator("#text-slider-value");
    const step1Icon = page.locator("#icon-step1-complete");
    const step2Icon = page.locator("#icon-step2-complete");
    const hardRebootBtn = page.locator("#btn-hard-reboot");
    const step3Container = page.locator("#step-3-button");

    // --- STEP 1 : Séquence d'amorçage ---
    await runSequence(page);

    await expect(step1Icon).toBeVisible();

    // STEP 3 encore verrouillé (flou + non interactif)
    await expect(step3Container).toHaveCSS("pointer-events", "none");
    await expect(step3Container).toHaveClass(/opacity-30/);
    await expect(step3Container).toHaveClass(/blur-sm/);

    // --- STEP 2 : Slider (tests des extrêmes) ---

    // 1 %
    await slider.fill("1");
    await expect(sliderValue).toHaveText("1%");

    // 99 %
    await slider.fill("99");
    await expect(sliderValue).toHaveText("99%");

    // 100 %
    await slider.fill("100");
    await expect(sliderValue).toHaveText("100%");
    await expect(step2Icon).toBeVisible();

    // STEP 3 déverrouillé (UX)
    await expect(step3Container).not.toHaveClass(/opacity-30/);
    await expect(step3Container).not.toHaveClass(/blur-sm/);

    // --- ZONE DE DANGER ---
    await expect(
      page.getByText(
        "CAUTION: Action irréversible. Risque de chômage immédiat."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Zone de Danger" })
    ).toBeVisible();

    // --- BOUTON DESTRUCTION ---
    await destroyBtn.hover();
    await destroyBtn.click();
    const destroyedTitle = page.locator("#text-system-destroyed");
    await expect(destroyedTitle).toBeVisible();
    await expect(destroyedTitle).toHaveText("SYSTÈME DÉTRUIT");

    // --- BOUTON HARD REBOOT ---
    await expect(hardRebootBtn).toBeVisible();
    await expect(hardRebootBtn).toBeEnabled();
    await expect(hardRebootBtn.locator("svg")).toBeVisible();
    await expect(hardRebootBtn).toHaveText(/Hard Reboot/);
    await hardRebootBtn.hover();
    await hardRebootBtn.click();

    // --- Vérification retour page login ---
    await expect(page.getByText("Accès restreint")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Déverrouiller" })
    ).toBeVisible();

    // --- Capture écran finale ---
    await page.screenshot({ path: "screenshots/final-step.png" });
  });
});
