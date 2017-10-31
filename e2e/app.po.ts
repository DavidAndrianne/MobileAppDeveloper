import { browser, by, element } from 'protractor';

export class Angular4ClickerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
