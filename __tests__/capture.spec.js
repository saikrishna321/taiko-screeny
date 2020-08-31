const {
  openBrowser,
  closeBrowser,
  screeny: { write, goto, setConfig }
} = require('taiko');

const fs = require('fs');
const dir = 'screen-capture';
const assert = require('assert');

describe('Capture screenshot for every action', async () => {
  beforeEach('Before Launch', async () => {
    await openBrowser();
  });

  afterEach('Before Launch', async () => {
    await closeBrowser();
  });
  it('Should be capturing screenshots for actions', async () => {
    await setConfig(dir);
    await goto('google.com');
    await write('Taiko.js');
    assert.equal(fs.readdirSync(dir).length, 2);
  });
});
