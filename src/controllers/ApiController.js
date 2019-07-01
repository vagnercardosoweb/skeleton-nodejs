class ApiController {
  index(req, res) {
    return res.json({
      error: false,
      message: 'Api successfully.',
    });
  }
}

export default new ApiController();
