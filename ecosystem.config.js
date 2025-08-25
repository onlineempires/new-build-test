module.exports = {
  apps: [{
    name: "digital-era-crm",
    script: "npm",
    args: "run dev",
    cwd: "/home/user/webapp",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    log_file: "/home/user/webapp/pm2.log",
    out_file: "/home/user/webapp/pm2-out.log",
    error_file: "/home/user/webapp/pm2-error.log",
    time: true
  }]
};