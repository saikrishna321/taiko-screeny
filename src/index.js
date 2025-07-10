export const ID = 'screeny';
const { info, success, error } = require('./logger');
const fs = require('fs-extra');
let fileDir;

export function init(taiko, eventEmitter) {
  const realFuncs = {};
  // screenshotDirectory();
  const event = taiko.emitter;
  let description;
  event.on('success', desc => {
    description = desc;
  });
  for (const func in taiko) {
    realFuncs[func] = taiko[func];
    if (
      realFuncs[func].constructor.name === 'AsyncFunction' &&
      !['screenshot', 'closeBrowser', 'openBrowser'].includes(func)
    ) {
      if (fileDir === undefined) fileDir = 'screeny';
      module.exports[func] = async function() {
        if (!(await fs.ensureDir(fileDir))) {
          await fs.mkdirp(fileDir);
        }
        await realFuncs[func].apply(this, arguments);
        info(`📸 Taking screenshot for action`, func);
        description = description.replace(/[^a-zA-Z0-9]/g, '_');
        if (description.length > 50) {
          description = description.substring(0, 50);
        }
        const fileName = `${fileDir}/${description}.png`;
        await taiko.screenshot({
          path: fileName
        });
        success(`🎉 Successfully saved ${fileName}`);
      };
    }
  }

  function screenshotDirectory() {
    const folder = fileDir || 'screeny';
    fs.emptyDir(folder)
      .then(() => {
        info('Deleting all files from screeny folder!');
      })
      .catch(err => {
        error(err);
      });
    f;
  }
}

export function setConfig(name) {
  fileDir = name;
}
module.exports = {
  ID,
  init,
  setConfig
};
