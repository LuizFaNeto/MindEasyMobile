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
});
