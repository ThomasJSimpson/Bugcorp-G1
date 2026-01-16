import { test, expect } from "@playwright/test";
import { beforeEach } from "node:test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://bugcorp.vercel.app/");
});

//1-Test d'Accès à la Page Contact
//Objectif : Vérifier que l'utilisateur peut accéder au formulaire Contact de plusieurs façons.
//s'assurer que la fonctionnalité est accessible
test("CT01 -Accéder à la page Contact depuis différentes navigations", async ({
  page,
}) => {
  // Test 1: Depuis le menu principal
  await page.getByTestId("nav-home").click();
  await page
    .locator("div") //
    .filter({ hasText: "Bienvenue chez BugCorp" });
  //.nth(2)
  //.click();
  await expect(page.locator("#nav-link-home")).toBeVisible();
  await expect(page.locator("#nav-link-home")).toContainText("Accueil");
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("heading", { name: "Contact Support" }).click();

  // Test 2: Depuis le lien "contact"
  await expect(page.locator("#nav-link-contact")).toBeVisible();
  await expect(page.locator("#nav-link-contact")).toContainText("Contact");
  await page.getByTestId("nav-contact").click();
  await page.getByRole("heading", { name: "Contact Support" }).click();
});

// 2 -Test de Remplissage et Soumission du Formulaire
//Toutes les données sont conformes aux exigences
//Vérifie que le système répond avec une confirmation ("TRANSMISSION RÉUSSIE")
test("CT02 - Remplir et soumettre le formulaire Contact avec données valides", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // 4. Attendre et vérifier
  await page.waitForTimeout(4000); // Attendre 4 secondes

  // Regarder ce qui s'affiche
  // const visibleText = await page.textContent("body"); //Prends tout le texte qui est affiché sur la page et mets-le dans une variable pour que je puisse le lire.

  // Vérifier la popup MAIS NE PAS FERMER
  await page.waitForTimeout(3000);

  // Vérifications principales
  await expect(
    page.locator("text=From: nina <test@bugcorp.com>")
  ).toBeVisible();
  await expect(page.locator("text=Subject: [philosophy]")).toBeVisible();
  await expect(page.locator("text=TRANSMISSION RÉUSSIE")).toBeVisible();

  console.log("Test CT01 réussi (popup vérifiée)");
});

//3- Réinitialisation après succès
//Vérifier que le bouton "Fermer & Réinitialiser" remplit deux fonctions :
//Fermer la popup de confirmation
//Réinitialiser le formulaire à son état initial
test("CT03- Réinitialisation après succès d'envoi du formulaire", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message");
  // Soumettre
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // Attendre succès
  const success = page.getByText(/TRANSMISSION RÉUSSIE/i);
  await expect(success).toBeVisible({ timeout: 20000 });

  // FERMER la popup (obligatoire)
  const closeReset = page.getByRole("button", {
    name: /Fermer & Réinitialiser/i,
  });
  await expect(closeReset).toBeVisible({ timeout: 5000 });
  await closeReset.click();

  // Revenir en haut et voir le titre

  const heading = page.getByRole("heading", { name: /Contact Support/i });
  await expect(heading).toBeVisible();

  // Formulaire vide
  await expect(page.getByRole("textbox", { name: "Votre Nom *" })).toHaveValue(
    ""
  );
  await expect(page.getByRole("textbox", { name: "Email *" })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Message *" })).toHaveValue(
    ""
  );
});

// 4- cas de test non valide "champ Nom (11111)"
//Devrait vérifier que c'est REJETÉ (ou afficher un message d’erreur) et empêcher la soumission.
test("CT04 - Contact - Nom numérique accepté", async ({ page }) => {
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("1111");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message ");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // ATTENTE + la pop-up s'affiche
  const modal = page.locator("#log-entry-0 > pre");
  await expect(modal).toContainText("1111");
  await expect(modal).toContainText("test@bugcorp.com");
  await page.pause();
});

// 5- Contact - email invalide "test@hjdshj" + nom+ message (vide)

test("CT05 - Contact - email invalide", async ({ page }) => {
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

// 6- test non valide avec un Email:444@4444gmail.com
test("CT06 - Contact - email invalide", async ({ page }) => {
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("44@444.gmail.com");
  await page.getByLabel("Sujet *").selectOption("philosophy");
  await page.getByRole("button", { name: "EMAIL" }).click();
  await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("message test");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // ATTENTE + la pop-up s'affiche
  const modal = page.locator("#log-entry-0 > pre");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("44@444.gmail.com");
  await page.pause();
});

// 7- cas de test champs obligatoires vides" Nom + Email + Message" vide
//Tester soumission sans données
test("CT07 - Contact - champs obligatoires vides", async ({ page }) => {
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

// 8 - Contact - email par défaut puis soumission, la pop-up affiche :SYSTEM_LOGS :: EMAIL
test("CT08 - Contact - EMAIL par défaut (preuve via pop-up)", async ({
  page,
}) => {
  await page.getByTestId("nav-home").click();
  await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("coffee");
  await page.getByLabel("Coupable Présumé (Optionnel)").selectOption("backend");
  //Les logs 'SYSTEM_LOGS :: EMAIL' montrent que la personnalisation fonctionne."
  const emailBtn = page.getByRole("button", { name: "EMAIL" });
  await expect(emailBtn).toHaveClass(/bg-indigo-600/);
  await expect(emailBtn).toHaveClass(/text-white/);
  await expect(emailBtn).toHaveClass(/scale-\[1.02\]/);

  await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("test message");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();
  // ATTENTE + la pop-up s'affiche
  const modal = page.locator("#log-entry-0 > pre");
  await expect(modal).toContainText("nina");
  await expect(modal).toContainText("test@bugcorp.com");
  await page.pause();
});

// 9 - Contact - changer le protocole, la pop-up affiche :SYSTEM_LOGS :: PIGEON VOYAGEUR
test("CT09 - Contact - par PIGEON VOYAGEUR  + optionnel (preuve via pop-up)", async ({
  page,
}) => {
  await page.getByTestId("nav-contact").click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).click();
  await page.getByRole("textbox", { name: "Votre Nom *" }).fill("nina");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page.getByRole("textbox", { name: "Email *" }).fill("test@bugcorp.com");
  await page.getByLabel("Sujet *").selectOption("crash");
  await page
    .getByLabel("Niveau de Panique (Optionnel)")
    .selectOption("moderate");
  await page.getByRole("button", { name: "PIGEON VOYAGEUR" }).click();
  await page.getByRole("textbox", { name: "Message *" }).click();
  await page.getByRole("textbox", { name: "Message *" }).fill("message test");
  await page
    .getByRole("button", { name: "Initialiser la Transmission" })
    .click();

  // 4. Attendre et vérifier
  await page.waitForTimeout(4000); // Attendre 4 secondes

  // Regarder ce qui s'affiche
  const visibleText = await page.textContent("body");

  // Vérifier la popup MAIS NE PAS FERMER
  await page.waitForTimeout(5000);

  // Vérifications principales
  await expect(page.locator("#console-header")).toContainText(
    "> SYSTEM_LOGS :: PIGEON"
  );
  await expect(
    page.locator("text=From: nina <test@bugcorp.com>")
  ).toBeVisible();
  await expect(page.locator("text=Subject: [crash]")).toBeVisible();
  await expect(page.locator("text=PIGEON DÉPLOYÉ")).toBeVisible();

  console.log("Test CT09 réussi (popup vérifiée)");

  //console.log("Test CT09 réussi (popup vérifiée)");
});
