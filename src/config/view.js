import { resolve } from 'path';

export default {
  enable: true,
  engine: 'twig',
  path: resolve(__dirname, '..', 'views'),
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
