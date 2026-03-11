module.exports = {
  apps: [
    {
      name: "cabelos-premium",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://gahalberto:senhaSimples123@127.0.0.1:5432/cabelos_db?schema=public",
        PORT: 3000
      }
    }
  ]
};
