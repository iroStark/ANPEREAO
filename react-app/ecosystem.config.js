module.exports = {
  apps : [{
    name   : "anpere-app",
    script : "./dist/index.js",
    env_production: {
      NODE_ENV: "production",
      PORT: 5000 // Porta padrão para Node.js na maioria dos hostings cPanel/Phusion Passenger
    }
  }]
}
