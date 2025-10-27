module.exports = {
  apps: [{
    name: 'cabelospremium',
    script: 'npm',
    args: 'start',
    cwd: '/home/yossi/cabelospremium',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3015
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3015
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
