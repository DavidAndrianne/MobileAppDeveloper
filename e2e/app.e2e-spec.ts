import { Angular4ClickerPage } from './app.po';

describe('angular4-clicker App', () => {
  let page: Angular4ClickerPage;

  beforeEach(() => {
    page = new Angular4ClickerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
