*** Settings ***
Documentation       Parcours Santé - Allergies & alerte produit (utilisateur déjà connecté)

Library             AppiumLibrary

Suite Setup         Ouvrir App
Suite Teardown      Fermer App


*** Variables ***
${REMOTE_URL}       http://127.0.0.1:4723
${TIMEOUT}          20s
${PSEUDO}           kahina213
${PRODUIT}          HERTA Pâte à Pizza Fine et Rectangulaire 390g


*** Test Cases ***
CT-ALL-01 - Sans allergie (aucune sélection)
    [Documentation]    Vérifier le comportement du produit quand aucune allergie n’est configurée
    Verifier_Deja_Connecte
    Reinitialiser_Allergies

    Ouvrir_Produit_Par_Recherche    ${PRODUIT}

    # Compatibilité visible
    Page Should Contain Element
    ...    android=new UiSelector().descriptionContains("Votre score de compatibilité")

    # Infos produit affichées (sans blocage utilisateur)
    Page Should Contain Element    accessibility_id=Contient : Gluten
    Page Should Contain Element    accessibility_id=Peut contenir : Lait
    Page Should Contain Element    accessibility_id=Ne contient pas : Arachides

    Retour

CT-ALL-02 - Allergie Gluten obligatoire
    [Documentation]    Vérifier l’impact d’une allergie gluten configurée sur le produit
    Verifier_Deja_Connecte
    Configurer_Gluten_Obligatoire

    Ouvrir_Produit_Par_Recherche    ${PRODUIT}

    # Compatibilité visible
    Page Should Contain Element
    ...    android=new UiSelector().descriptionContains("Votre score de compatibilité")

    # Alerte utilisateur attendue
    Page Should Contain Element    accessibility_id=Contient : Gluten

    Retour


*** Keywords ***
Ouvrir App
    [Documentation]    Ouvrir App via Appium
    Open Application    ${REMOTE_URL}
    ...    platformName=Android
    ...    appium:automationName=UIAutomator2
    ...    appium:appPackage=openfoodfacts.github.scrachx.openfood
    ...    appium:appActivity=org.openfoodfacts.app.MainActivity
    ...    appium:noReset=${True}
    ...    appium:dontStopAppOnReset=${True}
    ...    appium:ensureWebviewsHavePages=${True}
    ...    appium:nativeWebScreenshot=${True}
    ...    appium:newCommandTimeout=${3600}
    ...    appium:connectHardwareKeyboard=${True}

Fermer App
    [Documentation]    Ferme l'application.
    Close Application

Verifier Deja Connecte
    Wait Until Page Contains Element    xpath=//android.widget.TextView[@text="${PSEUDO}"]    ${TIMEOUT}
    Page Should Contain Element    xpath=//android.widget.TextView[@text="${PSEUDO}"]

Reinitialiser_Allergies
    [Documentation]    Remet les préférences alimentaires à l’état par défaut
    Wait Until Page Contains Element    accessibility_id=Préférences alimentaires    ${TIMEOUT}
    Click Element    accessibility_id=Préférences alimentaires
    Wait Until Page Contains Element    accessibility_id=Réinitialiser les préférences alimentaires    ${TIMEOUT}
    Click Element    accessibility_id=Réinitialiser les préférences alimentaires
    Retour

Configurer_Gluten_Obligatoire
    [Documentation]    Configure l’allergie Sans Gluten en obligatoire
    Wait Until Page Contains Element    accessibility_id=Préférences alimentaires    ${TIMEOUT}
    Click Element    accessibility_id=Préférences alimentaires
    Wait Until Page Contains Element    accessibility_id=Allergènes    ${TIMEOUT}
    Click Element    accessibility_id=Allergènes
    Wait Until Page Contains Element    accessibility_id=Sans Gluten    ${TIMEOUT}
    Click Element    accessibility_id=Sans Gluten
    Wait Until Page Contains Element    accessibility_id=Obligatoire    ${TIMEOUT}
    Click Element    accessibility_id=Obligatoire
    Retour

Ouvrir_Produit_Par_Recherche
    [Arguments]    ${produit_nom}
    Wait Until Page Contains Element    accessibility_id=Scanner    ${TIMEOUT}
    Click Element    accessibility_id=Scanner
    Wait Until Page Contains Element    accessibility_id=Chercher un produit    ${TIMEOUT}
    Click Element    accessibility_id=Chercher un produit
    Wait Until Page Contains Element    class=android.widget.EditText    ${TIMEOUT}
    Click Element    class=android.widget.EditText
    Clear Text    class=android.widget.EditText
    Input Text    class=android.widget.EditText    ${produit_nom}
    Wait Until Page Contains Element    accessibility_id=Rechercher    ${TIMEOUT}
    Click Element    accessibility_id=Rechercher
    Wait Until Page Contains Element
    ...    android=new UiSelector().descriptionContains("${produit_nom}")
    ...    ${TIMEOUT}
    Click Element
    ...    android=new UiSelector().descriptionContains("${produit_nom}")

Retour
    ${ok}=    Run Keyword And Return Status    Page Should Contain Element    accessibility_id=Retour
    IF    ${ok}    Click Element    accessibility_id=Retour    ELSE    Go Back
