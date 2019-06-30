class ApiController {
  index(req, res) {
    try {
      return res.json({
        error: false,
        message: 'Api successfully.',
      });
    } catch (err) {
      throw err;
    }
  }
}

export default new ApiController();
