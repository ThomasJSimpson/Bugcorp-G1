import { test, expect } from "@playwright/test";
import { chromium } from "playwright";

test.describe("Elements instables", () => {
  let browser;
  let page;
  test.beforeAll(async () => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://bugcorp.vercel.app/");
    await page.locator("#nav-link-unstable").click();
  });
  test.skip("Authentification 2FA, non passant code vide", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .first()
    ).toHaveText("Authentification 2FA");
    await page.fill('[id="2fa-input-field"]', "");
    await page.click('[id="2fa-validate-btn"]');
    const successLocator = page.locator('[id="2fa-error"]');
    await expect(successLocator).toBeVisible();
    await expect(successLocator).toHaveText(" Code incorrect ou expiré.");
  });
  test.skip("Authentification 2FA, non passant délai expiré", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .first()
    ).toHaveText("Authentification 2FA");
    const code2FA = await page.locator('[id="2fa-code-display"]').textContent();
    await page.fill('[id="2fa-input-field"]', code2FA.trim());
    await page.click('[id="2fa-validate-btn"]', { delay: 15000 });
    const successLocator = page.locator('[id="2fa-error"]');
    await expect(successLocator).toBeVisible();
    await expect(successLocator).toHaveText(" Code incorrect ou expiré.");
    await page.pause();
  });
  test.skip("Authentification 2FA, Passant", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .first()
    ).toHaveText("Authentification 2FA");
    const code2FA = await page.locator('[id="2fa-code-display"]').textContent();
    await page.fill('[id="2fa-input-field"]', code2FA.trim());
    await page.click('[id="2fa-validate-btn"]');
    const successLocator = page.locator('[id="2fa-success"]');
    await expect(successLocator).toBeVisible();
    await expect(successLocator).toHaveText("Code validé avec succès !");
  });

  test.skip("Le Bouton Éphémère", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .nth(1)
    ).toHaveText("Le Bouton Éphémère");
    await page.locator("#btn-start-loading").isVisible();
    await page.click("#btn-start-loading");
    await expect(page.locator("#btn-ephemeral")).toBeVisible({
      timeout: 5_000,
    });
    await page.click("#btn-ephemeral");
    await expect(page.locator("#msg-disarmed")).toHaveText(
      "Bombe désamorcée !"
    );
    await page.pause();
  });

  test.skip("Le Bouton Fantôme", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .nth(1)
    ).toHaveText("Le Bouton Éphémère");
    await page.locator("#btn-ghost").isVisible();
    await page.click("#btn-ghost");
    await expect(page.locator("#ghost-msg")).toHaveText(" Bien joué !");
    await page.pause();
  });

  test.skip("Vérification du Double clic", async () => {
    // Vérifier la présence du bouton de double clic
    await page.locator("#btn-double-click").isVisible();
    await page.dblclick("#btn-double-click");
    await expect(page.locator("#btn-double-click")).toHaveText(
      "Succès ! (Double Clic)",
      {
        timeout: 1_000,
      }
    );
  });

  test.skip("La Jauge de Précision", async ({ browser }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    );
    // Generate a random target percentage between 66 and 84
    const targetPercentage = Math.floor(Math.random() * 18) + 66;
    // Wait for the marker to reach this percentage (±1% tolerance)
    await page.waitForFunction((target) => {
      const marker = document.querySelector("#gauge-marker");
      if (!marker) return false;

      const match = marker.style.left.match(/calc\((\d+\.?\d*)%/);
      if (!match) return false;

      const percentage = parseFloat(match[1]);
      return Math.abs(percentage - target) <= 1;
    }, targetPercentage);

    await page.click("#btn-gauge-action");
    await expect(page.locator("#gauge-msg-success")).toHaveText("PARFAIT !");
    await expect(page.locator("#gauge-msg-success")).toBeVisible();
    await page.pause();
  });

  test.skip("Le Clic Droit, passant", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .nth(5)
    ).toHaveText("Le Clic Droit");
    // Vérifier la présence du bouton de clic droit
    await page.locator("#area-context-menu").isVisible();
    await page.click("#area-context-menu", { button: "right" });
    await page.waitForSelector("#ctx-menu-validate", { timeout: 1000 });
    await expect(page.locator("#ctx-menu-validate")).toHaveText(
      " Valider la sécurité"
    );
    await page.locator("#ctx-menu-validate").click();
    await expect(page.locator("#area-context-menu")).toHaveText(
      " Validation Réussie !"
    );
    await page.pause();
  });
  test("Le Clic Droit, non passant (HTML EXACT)", async () => {
    await expect(
      page
        .locator(
          ".text-lg.font-bold.text-slate-800.mb-4.flex.items-center.gap-2"
        )
        .nth(5)
    ).toHaveText("Le Clic Droit");
    await expect(page.locator("#area-context-menu")).toBeVisible();
    await page.locator("#area-context-menu").click({ button: "right" });
    await page.waitForSelector("#custom-context-menu", { timeout: 1000 });
    const tousTextes = await page
      .locator("#custom-context-menu div")
      .allTextContents();
    const mauvaisChoix = page.locator(
      "#custom-context-menu div" +
        ":not(#ctx-menu-validate)" + // ❌ Valider la sécurité
        ":not([class*='h-px'])" + // ❌ Séparateur hauteur
        ":not([class*='my-1'])" + // ❌ Séparateur margin
        ":not(:empty)" // ❌ Vide
    );
    const nbMauvais = await mauvaisChoix.count();

    if (nbMauvais === 0) {
      throw new Error(` Menu vide ! Items: ${tousTextes.join(", ")}`);
    }

    const indexAleatoire = Math.floor(Math.random() * nbMauvais);
    const choixTexte = await mauvaisChoix.nth(indexAleatoire).textContent();

    await mauvaisChoix.nth(indexAleatoire).click({ timeout: 1000 });

    // 7. ÉCHEC attendu
    await page.waitForTimeout(1000);
    await expect(page.locator("#area-context-menu")).toHaveText(
      " Mauvaise option !"
    );
    await page.pause();
  });
});
