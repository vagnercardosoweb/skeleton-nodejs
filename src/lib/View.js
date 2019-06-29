import twig from 'twig';
import { view } from '../config';

export default class View {
  constructor(app) {
    this.app = app;
  }

  init() {
    const { engine } = view;

    switch (engine) {
      case 'twig':
        this._initTwig();
        break;

      default:
        throw new Error('There is no other view engine configured.');
    }
  }

  _initTwig() {
    const { path, engine, options } = view;

    this.app.set('views', path);
    this.app.set('view engine', engine);
    this.app.set('twig options', options);

    this._twigMountGloalAndFunctionAndFilters();
  }

  _twigMountGloalAndFunctionAndFilters() {
    const { functions, filters } = view;

    // Function && Filters
    [functions, filters].map(item => {
      Object.keys(item).map(key => {
        if (functions.hasOwnProperty(key)) {
          twig.extendFunction(key, item[key]);
        }

        if (filters.hasOwnProperty(key)) {
          twig.extendFilter(key, item[key]);
        }
      });
    });
  }
}
