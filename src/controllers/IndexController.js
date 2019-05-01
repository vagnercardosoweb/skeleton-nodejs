class IndexController {
  index (request, response) {
    return response.render('index', {
      title: 'VCWeb Networks'
    })
  }
}

module.exports = new IndexController()
