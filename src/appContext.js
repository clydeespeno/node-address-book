import awilix from 'awilix';
import config from './config';
import contactModules from './contacts';
import addressboookModules from './addressbook';
import koaApp from './koaApp';
import {asSingleton} from './modules';

const {createContainer} = awilix;

export default (overrides = {}) => {
  const container = createContainer();

  const modules = {
    ...asSingleton({
      config,
      koaApp
    }),
    ...addressboookModules,
    ...contactModules,
  };

  container.register({...modules, ...overrides});

  return container;
};

