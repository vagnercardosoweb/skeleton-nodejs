// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

class ApiController {
  /**
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    return res.success({
      date: new Date(),
      company: 'VCWeb Networks',
      developer: 'Vagner dos Santos Cardoso',
    });
  }
}

export default new ApiController();
