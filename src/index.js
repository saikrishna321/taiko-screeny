export const ID = 'screeny';
const { info, success, error } = require('./logger');
const fs = require('fs-extra');
export function init(taiko, eventEmitter) {
  const realFuncs = {};
  fs.emptyDir('screeny')
    .then(() => {
      info('Deleting all files from screeny folder!');
    })
    .catch(err => {
      error(err);
    });
  const event = taiko.emitter;
  let description;
  event.on('success', desc => {
    description = desc;
  });
  for (const func in taiko) {
    realFuncs[func] = taiko[func];
    if (
      realFuncs[func].constructor.name === 'AsyncFunction' &&
      !['screenshot', 'closeBrowser'].includes(func)
    ) {
      module.exports[func] = async function() {
        await realFuncs[func].apply(this, arguments);
        info(`📸 Taking screenshot for action`, func);
        const fileName = `screeny/${description.replace(
          /[^a-zA-Z0-9]/g,
          '_'
        )}.png`;
        await taiko.screenshot({
          path: fileName
        });
        success(`🎉 Successfully saved ${fileName}`);
      };
    }
  }
}

module.exports = {
  ID,
  init
};
