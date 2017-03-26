import glob from 'glob';
import path from 'path';
import awilix from 'awilix';

export const scanModules = (directory, exclude = []) =>
  glob.sync(`${directory}/*.js`).reduce((m, file) => {
    const base = path.basename(file, '.js');
    if (!exclude.find(e => base === e)) {
      m[base] = require(file).default;
    }
    return m;
  }, {});

export function asSingleton(deps) {
  return Object.keys(deps).reduce((ms, d) => {
    ms[d] = awilix.asFunction(deps[d]).singleton();
    return ms;
  }, {});
}
