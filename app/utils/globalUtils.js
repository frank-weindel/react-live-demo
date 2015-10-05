/*
  globalUtils
 */

 /**
  * Calls the callback and returns its result if the expression is truthy
  *
  * @param  {string}   expression
  * @param  {Function} callback
  * @return {variant}              Value of callback() if expression is true. Otherwise 'undefined'
  */
export function iff(expression, callback) {
  if (expression) {
    return callback();
  }
  return void 0;
}

const globalUtils = {
  iff,
  log: function (...items) {
    /* eslint-disable no-console */
    if (!console || !console.log) {
      return;
    }
    /*
      IE9 doesn't like: console.log.apply(console, items);
     */
    Function.prototype.apply.call(console.log, console, items);
    /* eslint-enable no-console */
  },
  error: function (...items) {
    /* eslint-disable no-console */
    if (!console || !console.error) {
      return;
    }
    /*
      IE9 doesn't like: console.error.apply(console, items);
     */
    Function.prototype.apply.call(console.error, console, items);
    /* eslint-enable no-console */
  }
};

/*
  Use plain console.log / console.error when available (to preserve line numbers!)
 */
/* eslint-disable no-console */
if (console && console.log && console.log.bind) {
  globalUtils.log = console.log.bind(console);
}

if (console && console.error && console.error.bind) {
  globalUtils.error = console.error.bind(console);
}
/* eslint-enable no-console */

export default globalUtils;
