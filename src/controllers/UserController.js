import User from '../models/User';

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'created_at', 'updated_at'],
      });

      return res.json(users);
    } catch (err) {
      return res.status(500).json({
        error: true,
        status: 500,
        message: 'Server error',
        err,
      });
    }
  }

  // async saveImage(req, res) {
  //   try {
  //     return res.json({
  //       file: req.file,
  //       body: req.body,
  //       params: req.params,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       error: true,
  //       status: 500,
  //       message: err,
  //     });
  //   }
  // }
}

export default new UserController();
