import { Angular5ClickerPage } from './app.po';

describe('Angular5-clicker App', () => {
  let page: Angular5ClickerPage;

  beforeEach(() => {
    page = new Angular5ClickerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
