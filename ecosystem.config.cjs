module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      }
    }
  ]
}