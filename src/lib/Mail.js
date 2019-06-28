import nodemailer from 'nodemailer';
import Twig from 'twig';
import { resolve } from 'path';
import configMail from '../config/mail';

class Mail {
  constructor() {
    this.options = {};

    const { host, port, secure, auth } = configMail;

    this.nodemailer = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.nodemailer.use('compile', this.twigCompileHtml);
  }

  twigCompileHtml(mail, callback) {
    if (mail.data.html) {
      return callback();
    }

    const template = resolve(
      __dirname,
      '..',
      'views',
      'mail',
      `${mail.data.template}.twig`
    );

    Twig.renderFile(template, mail.data.context, (err, html) => {
      if (err) {
        throw err;
      }

      mail.data.html = html;

      callback();
    });

    return mail;
  }

  from(name, mail) {
    this.options.from = `${name} <${mail}>`;

    return this;
  }

  to(name, mail) {
    this.options.to = `${name} <${mail}>`;

    return this;
  }

  replyTo(name, mail) {
    this.options.replyTo = `${name} <${mail}>`;

    return this;
  }

  text(text) {
    this.options.text = String(text);

    return this;
  }

  template(name, context) {
    this.options.template = name;
    this.options.context = context || {};

    return this;
  }

  html(html) {
    this.options.html = html;

    return this;
  }

  headers(headers) {
    this.options.headers = headers;

    return this;
  }

  attachments(attachments) {
    this.options.attachments = attachments;

    return this;
  }

  subject(subject) {
    this.options.subject = String(subject);

    return this;
  }

  send(mailOptions) {
    const { options } = configMail;

    return this.nodemailer.sendMail({
      ...options,
      ...this.options,
      ...mailOptions,
    });
  }
}

export default new Mail();
