import { resolve } from 'path';
import nodemailer from 'nodemailer';
import Twig from 'twig';

import config from '../config/mail';

class Mail {
  constructor() {
    this.options = {};

    const { host, port, secure, auth } = config;

    this.mailer = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.mailer.use('compile', this.compileTwig);
  }

  compileTwig(plugin, callback) {
    if (plugin.data.html) {
      return callback();
    }

    // Prevent duplicate extension .twig
    let { template } = plugin.data;
    template = template.replace(/.twig$/gi, '');
    template = resolve(__dirname, '..', 'views', 'mail', `${template}.twig`);

    // Compile new html
    const { context } = plugin.data;
    Twig.renderFile(template, context, (err, html) => {
      if (err) {
        throw err;
      }

      plugin.data.html = html;

      callback();
    });

    return plugin;
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

  send(options) {
    return this.mailer.sendMail({
      ...config.options,
      ...this.options,
      ...options,
    });
  }
}

export default new Mail();
