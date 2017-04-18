import mobx from 'mobx';

const DEFAULT_STYLE = 'color: #006d92; font-weight:bold;';

// Utilities
const repeat = (str, times) => (new Array(times + 1)).join(str);
const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;
const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

// Just call this function after MobX initialization
// As argument you can pass an object with:
// - collapsed: true   -> shows the log collapsed
// - style             -> the style applied to the action description
export default ({ collapsed, style } = {}) => {
  mobx.spy((event) => {
    if (event.type === 'action') {
      if (collapsed) {
        console.groupCollapsed(`Action @ ${formatTime(new Date())} ${event.name}`);
      } else {
        console.group(`Action @ ${formatTime(new Date())} ${event.name}`);
      }
      console.log('%cType: ', style || DEFAULT_STYLE, event.type);
      console.log('%cName: ', style || DEFAULT_STYLE, event.name);
      console.log('%cTarget: ', style || DEFAULT_STYLE, event.target);
      console.log('%cArguments: ', style || DEFAULT_STYLE, event.arguments);
      console.groupEnd();
    }
  });
};
