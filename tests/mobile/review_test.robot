*** Settings ***
Documentation    Fluxo de avaliação alinhado com app/therapist/review.tsx (testIDs).
...              Executar com Appium local; no CI usa-se apenas robot --dryrun.
Library          AppiumLibrary

Suite Setup       Abrir Aplicativo
Suite Teardown    Close Application

*** Variables ***
${REMOTE_URL}       http://127.0.0.1:4723/
${PLATFORM_NAME}    Android
${DEVICE_NAME}      emulator-5554
${APP_PACKAGE}      com.mindeasy
${APP_ACTIVITY}     .MainActivity

*** Test Cases ***
Deve Avaliar Profissional Com Sucesso
    Wait Until Page Contains    Avaliar Profissional

    Wait Until Element Is Visible    accessibility_id=star-5    15
    Click Element    accessibility_id=star-5

    Input Text    accessibility_id=comment-input    Excelente atendimento

    Click Element    accessibility_id=submit-button

    Wait Until Page Contains    Obrigado!

*** Keywords ***
Abrir Aplicativo
    Open Application    ${REMOTE_URL}
    ...    platformName=${PLATFORM_NAME}
    ...    deviceName=${DEVICE_NAME}
    ...    appPackage=${APP_PACKAGE}
    ...    appActivity=${APP_ACTIVITY}
    ...    automationName=UiAutomator2
