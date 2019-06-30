class IndexController {
  index(req, res) {
    try {
      return res.render('index');
    } catch (err) {
      throw err;
    }
  }
}

export default new IndexController();
