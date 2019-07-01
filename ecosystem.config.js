module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './src/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '',
      interpreter: './node_modules/sucrase/bin/sucrase-node',
      instances: 1,
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'node',
  //     host: '212.83.163.1',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/production',
  //     'post-deploy':
  //       'npm install && pm2 reload ecosystem.config.js --env production',
  //   },
  // },
};
