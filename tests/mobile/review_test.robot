*** Settings ***
Library    AppiumLibrary

Suite Setup       Abrir Aplicativo
Suite Teardown    Close Application

*** Variables ***
${REMOTE_URL}       http://localhost:4723/wd/hub
${PLATFORM_NAME}    Android
${DEVICE_NAME}      emulator-5554
${APP_PACKAGE}      com.mindeasy
${APP_ACTIVITY}     .MainActivity

*** Test Cases ***
Deve Avaliar Profissional Com Sucesso
    Wait Until Page Contains    Avaliar Profissional

    Click Element    xpath=(//android.widget.Button)[5]

    Input Text    xpath=//android.widget.EditText    Excelente atendimento

    Click Element    xpath=//android.widget.Button[@content-desc="Enviar Avaliação"]

    Wait Until Page Contains    Obrigado!

*** Keywords ***
Abrir Aplicativo
    Open Application    ${REMOTE_URL}
    ...    platformName=${PLATFORM_NAME}
    ...    deviceName=${DEVICE_NAME}
    ...    appPackage=${APP_PACKAGE}
    ...    appActivity=${APP_ACTIVITY}
    ...    automationName=UiAutomator2
