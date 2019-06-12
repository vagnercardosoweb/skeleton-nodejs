const path = require('path')
const fs = require('fs')

module.exports = async (req, res, next) => {
  const envPath = path.resolve(__dirname, '..', '..', '.env')
  const envExamplePath = path.resolve(__dirname, '..', '..', '.env-example')

  await fs.access(envPath, 'utf8', async (err) => {
    if (err) {
      await fs.readFile(envExamplePath, async (err, content) => {
        if (!err) {
          await fs.writeFile(envPath, content, () => {})
        } else {
          console.log(err)
        }
      })
    }
  })

  next()
}
