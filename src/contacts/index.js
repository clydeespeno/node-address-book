import {scanModules, asSingleton} from '../modules';

export default asSingleton(scanModules(__dirname, ['index']));
