import * as Yup from 'yup';
import { validateCpf, validateCnpj, onlyNumber } from '../helpers';

Yup.string.prototype.cpf = function cpf(message) {
  message = message || 'CPF informado não é válido.';

  return this.test({
    name: 'cpf',
    message,
    exclusive: true,
    test: validateCpf,
  });
};

Yup.string.prototype.cnpj = function cnpj(message) {
  message = message || 'CNPJ informado não é válido.';

  return this.test({
    name: 'cnpj',
    message,
    exclusive: true,
    test: validateCnpj,
  });
};

Yup.string.prototype.phone = function phone(message) {
  message = message || 'Telefone informado deve contér DD+NÚMERO.';

  return this.transform(value =>
    this.isType(value) ? onlyNumber(value) : value
  ).test({
    name: 'phone',
    message,
    exclusive: true,
    test(value) {
      if (String(value).length < 11 || String(value).length > 15) {
        return false;
      }

      return true;
    },
  });
};

export default Yup;
