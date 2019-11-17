// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

class IndexController {
  /**
   * @param {Request} req
   * @param {Response} res
   */
  index(req, res) {
    return res.render('index');
  }
}

export default new IndexController();
