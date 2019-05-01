const configFolder = require('../../config/folder')
const configPackage = require(`${configFolder.ROOT}/package.json`)

class UserController {
  index (request, response) {
    return response.json(configPackage)
  }
}

module.exports = new UserController()
