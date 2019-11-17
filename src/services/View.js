import twig from 'twig';
import nunjucks from 'nunjucks';
import config from '../config/view';

export default class View {
  constructor(app) {
    this.app = app;
  }

  init() {
    const { engine } = config;

    switch (engine) {
      case 'twig':
      case 'html':
        this._initTwig();
        break;

      case 'nunjucks':
      case 'njk':
        this._initNunjucks();
        break;

      default:
        throw new Error('There is no other view engine configured.');
    }
  }

  _initNunjucks() {
    const { path, engine, options, filters } = config;

    // Configure engine
    const env = nunjucks.configure(path, {
      ...options,
      express: this.app,
    });

    this.app.set('view engine', engine);

    // Filters
    [filters].map(item => {
      Object.keys(item).map(key => {
        env.addFilter(key, item[key]);
      });
    });
  }

  _initTwig() {
    const { path, engine, options, functions, filters } = config;

    // Configure engine
    this.app.set('views', path);
    this.app.set('view engine', engine);

    if (engine === 'html') {
      this.app.engine('html', twig.__express);
    }

    this.app.set('twig options', options);

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
