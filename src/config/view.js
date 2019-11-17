import configApp from './app';

export default {
  enable: true,
  engine: 'twig', // twig || nunjucks (njk)
  path: configApp.path.views,
  options: {},
  functions: {
    toUpperCase(value) {
      return value.toUpperCase();
    },
  },
  filters: {
    toUpperCase(value) {
      return value.toUpperCase();
    },
  },
};
