module.exports = {
  apps: [
    {
      name: "ogunstartups",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/ogunstartups/htdocs/ogunstartups.ng",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
