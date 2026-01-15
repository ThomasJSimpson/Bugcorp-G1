import { test, expect } from "@playwright/test";
import { beforeEach } from "node:test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
});

// CT01 - Contact - soumission valide (EMAIL)
//
test("CT01 - Contact - soumission valide (EMAIL)", async ({ page }) => {
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  // await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  // await page.getByRole("textbox", { name: "Email *" }).click();
  // await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp");
  // await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  // await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.");
  // await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  // await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByRole("textbox", { name: "Email *" }).click();
  // await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();

  await page.getByRole("textbox", { name: "Message *" }).fill("test message");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // ATTENTE + ASSERTION DE LA MODALE
  const modal = page.locator("#log-entry-0 > pre");

  //await expect(modal).toBeVisible({ timeout: 15_000 });
  //await expect(modal).toContainText("/message transmis/i");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("test@bugcorp.com");
  await page.pause();
});

// 2- cas de test non valide "champ Nom (11111)"
// Aucun message d’erreur n’est affiché sur le champ “Votre Nom”.
//Le champ “Votre Nom” doit refuser les chiffres (ou afficher un message d’erreur) et empêcher la soumission.
//Dans les logs, le champ “From” affiche 11111 <test@bugcorp.com>.

test("CT02 - Contact - Nom numérique accepté", async ({ page }) => {
  //
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  // await page.getByRole('textbox', { name: 'Votre Nom *' }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("1111");
  // await page.getByRole('textbox', { name: 'Email *' }).click();
  // await page.getByRole('textbox', { name: 'Email *' }).press('CapsLock');
  // await page.getByRole('textbox', { name: 'Email *' }).fill('test@bugcorp');
  // await page.getByRole('textbox', { name: 'Email *' }).press('CapsLock');
  // await page.getByRole('textbox', { name: 'Email *' }).fill('test@bugcorp.');
  // await page.getByRole('textbox', { name: 'Email *' }).press('CapsLock');
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  // await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message ");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // ATTENTE + ASSERTION DE LA MODALE
  const modal = page.locator("#log-entry-0 > pre");

  //await expect(modal).toBeVisible({ timeout: 15_000 });
  //await expect(modal).toContainText("/message transmis/i");
  await expect(modal).toContainText("1111");
  await expect(modal).toContainText("test@bugcorp.com");
  await page.pause();
});

// 3- cas de test non valide avec un Email:test@bugcorp com
//à la soumission avec un email invalide, aucun message d’erreur UI n’est affiché immédiatement.
// La validation apparaît seulement après interaction avec le champ Email (re-clic / délai)
// via le message natif navigateur

//
// CT03 - Contact - email invalide "test@hjdshj" + nom+ message (vide)
test("CT03 - Contact - email invalide", async ({ page }) => {
  await page.getByTestId("nav-contact").click();
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@hjdshj");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  await expect(page.locator("#error-contact-email")).toContainText(
    "Une adresse email valide est requise."
  );
});

// 4- test non valide avec un Email:444@4444gmail.com
test("CT04 - Contact - email invalide", async ({ page }) => {
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  // await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  await page.getByRole("textbox", { name: "Email *" }).fill("44@444.gmail.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  // await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("message test");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // ATTENTE + ASSERTION DE LA MODALE
  const modal = page.locator("#log-entry-0 > pre");

  //await expect(modal).toBeVisible({ timeout: 15_000 });
  //await expect(modal).toContainText("/message transmis/i");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("44@444.gmail.com");
  await page.pause();
});

// 5- cas de test champs obligatoires vides" Nom + Email + Message" vide
test("CT05 - Contact - champs obligatoires vides", async ({ page }) => {
  await page.getByTestId("nav-contact").click();
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  await expect(page.locator("#error-contact-email")).toContainText(
    "Une adresse email valide est requise."
  );
  await expect(page.locator("#error-contact-name")).toContainText(
    "Votre nom est requis (min 2 caractères)."
  );
  await expect(page.locator("#error-contact-message")).toContainText(
    "Votre message doit contenir au moins 10 caractères."
  );
});

/**Après soumission sans changer le protocole, la pop-up affiche :SYSTEM_LOGS :: EMAIL
// 6 - Contact - email par défaut puis soumission
 */
test("CT06 - Contact - EMAIL par défaut (preuve via pop-up)", async ({
  page,
}) => {
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  // await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  // await page.getByRole("textbox", { name: "Email *" }).click();
  // await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp");
  // await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  // await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.");
  // await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("coffee");
  await page.getByLabel("Niveau de Panique (Optionnel)").selectOption("high");
  await page.getByLabel("Coupable Présumé (Optionnel)").selectOption("backend");
  await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  // ATTENTE + ASSERTION DE LA MODALE
  const modal = page.locator("#log-entry-0 > pre");

  //await expect(modal).toBeVisible({ timeout: 15_000 });
  //await expect(modal).toContainText("/message transmis/i");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("test@bugcorp.com");
  await page.pause();
});

/**Après soumission changer le protocole, la pop-up affiche :SYSTEM_LOGS :: PIGEON VOYAGEUR
// 7 - Contact - email par défaut puis soumission
 */
test("CT07 - Contact - par PIGEON VOYAGEUR  + optionnel (preuve via pop-up)", async ({
  page,
}) => {
  await page.goto("https://bugcorp.vercel.app/");
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  // await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  // await page.getByRole("textbox", { name: "Votre Nom *" }).press("CapsLock");
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page
    .getByRole("textbox", { name: "Email *" })
    .fill("testbugcorp@gmail");
  await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  await page
    .getByRole("textbox", { name: "Email *" })
    .fill("testbugcorp@gmail.");
  await page.getByRole("textbox", { name: "Email *" }).press("CapsLock");
  await page
    .getByRole("textbox", { name: "Email *" })
    .fill("testbugcorp@gmail.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "PIGEON VOYAGEUR" }).click();
  // await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("message test");
  await page.getByLabel("Niveau de Panique (Optionnel)").selectOption("high");
  await page
    .getByLabel("Coupable Présumé (Optionnel)")
    .selectOption("frontend");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  // ATTENTE + ASSERTION DE LA MODALE
  const modal = page.locator("#log-entry-0 > pre");

  //await expect(modal).toBeVisible({ timeout: 15_000 });
  //await expect(modal).toContainText("/message transmis/i");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("testbugcorp@gmail.com");
  await page.pause();
});
