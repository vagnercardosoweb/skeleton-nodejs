import { resolve } from 'path';

export default {
  enable: true,
  engine: 'twig', // twig || nunjucks (njk)
  path: resolve(__dirname, '..', '..', 'src', 'views'),
  options: {},
  functions: {
    toUpper(value) {
      return value.toUpperCase();
    },
  },
  filters: {
    toUpper(value) {
      return value.toUpperCase();
    },
  },
};
