class IndexController {
  index(req, res) {
    return res.render('index');
  }
}

export default new IndexController();
