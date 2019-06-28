// import Mail from '../lib/Mail';

class IndexController {
  async index(req, res) {
    // const mailInfo = await Mail.subject('Teste de mensagem.')
    //   .from('Vagner Cardoso', 'vagnercardosoweb@gmail.com')
    //   .to('Bruna Cardoso', 'bruna@gmail.com')
    //   .replyTo('Vagner', 'vagner@gmail.com')
    //   .text('Texto...')
    //   .template('test', { name: 'Vagner Cardoso' })
    //   .send();

    // console.log(mailInfo);

    return res.render('index', {
      title: 'VCWeb Networks',
    });
  }
}

export default new IndexController();
