const { test, expect } = require("@playwright/test");

// Récupération des variables
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const PRODUCT = process.env.PRODUCT;

test.describe("connexion + recherche + ajout panier + vérif panier", () => {
  test("fait tout d'un coup", async ({ page }) => {
    // ÉTAPE 1 : CONNEXION
    await test.step("ÉTAPE 1 : Connexion", async () => {
      await page.goto("/");
      await expect(page.locator(".page-title-text")).toContainText("Boutique");
      await page.locator(".menu-item-2772").click();
      await expect(page.locator(".page-title-text")).toContainText("Mon compte");

      // Login Utilisateur (USER)
      await page.locator("#username").fill(USER);
      await page.locator("#password").fill(PASSWORD);
      await page.locator("#rememberme").click();
      await expect(page.locator(".woocommerce-form-login__submit")).toContainText("Se connecter");
      await page.locator(".woocommerce-form-login__submit").click();

      // Vérif.
      await expect(page.locator(".woocommerce-MyAccount-content p").first()).toContainText(`Bonjour ${USER}`);
    });

    // ÉTAPE 2 : RECHERCHE + AJOUT
    await test.step("ÉTAPE 2 : Recherche produit", async () => {
      await page.waitForLoadState("networkidle");
      await page.locator(".search-overlay-trigger").click();
      await page.waitForLoadState("networkidle");
      // 3. On clique
      await page.locator(".apsw-search-input").fill(PRODUCT);
      // On cible le premier résultat
      const firstResult = page.locator("ul.apsw_data_container li").first();
      await expect(firstResult.locator(".apsw-name")).toContainText(PRODUCT);
      await firstResult.click();
      // Vérif.
      await expect(page.locator(".product_title").first()).toContainText(PRODUCT);
      await page.locator(".single_add_to_cart_button").click();
    });

    // ÉTAPE 3 : Vérif PANIER
    await test.step("ÉTAPE 3 : Ajout panier", async () => {
      // Aller au panier + vérif.
      await page.locator(".menu-item-2773").click();
      await expect(page.locator(".page-title-text")).toContainText("Panier");
      // On attend que le tableau du panier soit visible
      await page.waitForLoadState("networkidle");

      await expect(page.locator(".wc-block-cart-items__row").first()).toBeVisible();

      // Récupération de toutes les lignes
      const cartRows = await page.locator(".wc-block-cart-items__row").all();

      const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(priceStr.replace("€", "").replace(",", ".").replace(/\s/g, "").trim());
      };

      console.log(`Nombre d'articles différents trouvés : ${cartRows.length}`);

      let allTotalRow = 0;

      for (const row of cartRows) {
        const unitPriceText = await row.locator(".wc-block-cart-item__prices .wc-block-components-product-price__value").innerText();
        const unitPrice = parsePrice(unitPriceText);
        console.log("Prix unitaire :", unitPrice);

        // 2. QUANTITÉ
        const quantityValue = await row.locator(".wc-block-components-quantity-selector__input").inputValue();
        const quantity = parsePrice(quantityValue);
        console.log("Quantité :", quantity);

        // 3. TOTAL LIGNE
        const totalRowText = await row.locator(".wc-block-cart-item__total .wc-block-components-product-price__value").innerText();
        const totalRow = parsePrice(totalRowText);
        console.log("Total ligne :", totalRow);

        const calcul = unitPrice * quantity;
        // On accepte une différence de 0.1 pour les arrondis
        if (Math.abs(calcul - totalRow) > 0.1) {
          console.error(`⚠️ Erreur de calcul : ${unitPrice} * ${quantity} = ${calcul}, mais affiché ${totalRow}`);
        } else {
          console.log("✅ Calcul OK");
          allTotalRow += totalRow;
        }
        console.log("---");
      }
      console.log("GRAND TOTAL CALCULé :", allTotalRow);
      const footerTotalText = await page.locator(".wc-block-components-totals-footer-item .wc-block-components-formatted-money-amount").innerText();
      const footerTotal = parsePrice(footerTotalText);
      console.log("GRAND TOTAL AFFICHÉ (SITE) :", footerTotal);

      // 3. La comparaison intelligente
      // Au lieu de "toBe", on utilise "toBeCloseTo" pour gérer les micro-différences de virgule
      expect(allTotalRow).toBeCloseTo(footerTotal, 2);
    });

    // ÉTAPE 4 : DÉCONNEXION
    await test.step("ÉTAPE 4 : Déconnexion", async () => {
      await page.locator(".header-icon .icofont-user-alt-4").hover();
      await page.locator(".woocommerce-MyAccount-navigation-link--customer-logout").click();
      await expect(page.locator(".woocommerce-form-login__submit")).toBeVisible();
    });
  });
});

//  await page.getByTestId("nav-home").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-directory").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-secure").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-unstable").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-contact").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-home").click();
//   // await page.waitForTimeout(2000);

//   await page.getByRole("button", { name: "Accéder à l'Annuaire" }).click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-home").click();
//   // await page.waitForTimeout(2000);

//   await page.getByRole("button", { name: "Pirater le Système" }).click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-home").click();
//   // await page.waitForTimeout(2000);

//   await page.getByRole("button", { name: "Tester vos réflexes" }).click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-home").click();
//   // await page.waitForTimeout(2000);

//   await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-directory").click();
//   // await page.waitForTimeout(2000);

//   await page.locator("#screen-login").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-unstable").click();
//   // await page.waitForTimeout(2000);

//   await page.getByTestId("nav-contact").click();
//   // await page.waitForTimeout(2000);
