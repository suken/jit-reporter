import { JitReporterPage } from './app.po';

describe('jit-reporter App', () => {
  let page: JitReporterPage;

  beforeEach(() => {
    page = new JitReporterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
