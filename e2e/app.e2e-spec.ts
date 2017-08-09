import { MyLocationsPage } from './app.po';

describe('my-locations App', () => {
  let page: MyLocationsPage;

  beforeEach(() => {
    page = new MyLocationsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
