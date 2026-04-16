describe('Tela de Avaliação', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('deve enviar avaliação com sucesso', async () => {
    await element(by.id('star-5')).tap();
    await element(by.id('comment-input')).typeText('Muito bom');
    await element(by.id('submit-button')).tap();

    await expect(element(by.id('success-dialog'))).toBeVisible();
  });
  module.exports = {
  testRunner: 'jest',
  configurations: {
    'android.emu.debug': {
      type: 'android.emulator',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  }
};
});