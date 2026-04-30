*** Settings ***
Library    AppiumLibrary

*** Variables ***
${REMOTE_URL}    http://localhost:4723/wd/hub
${PLATFORM_NAME}    Android
${DEVICE_NAME}    emulator-5554
${APP_PACKAGE}    com.seuapp
${APP_ACTIVITY}    .MainActivity

*** Test Cases ***
Deve Avaliar Profissional Com Sucesso
    Open Application    ${REMOTE_URL}
    ...    platformName=${PLATFORM_NAME}
    ...    deviceName=${DEVICE_NAME}
    ...    appPackage=${APP_PACKAGE}
    ...    appActivity=${APP_ACTIVITY}
    ...    automationName=UiAutomator2

    # Espera tela carregar
    Wait Until Page Contains    Avaliar Profissional

    # Clica na 5ª estrela
    Click Element    xpath=(//android.widget.Button)[5]

    # Digita comentário
    Input Text    xpath=//android.widget.EditText    Excelente atendimento

    # Clica em enviar
    Click Element    xpath=//android.widget.Button[@content-desc="Enviar Avaliação"]

    # Verifica modal
    Wait Until Page Contains    Obrigado!

    Close Application