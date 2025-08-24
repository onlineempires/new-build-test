module.exports = {
  apps: [{
    name: 'digital-era-webapp',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/home/user/webapp',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
}
