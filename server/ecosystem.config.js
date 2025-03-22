module.exports = {
  apps : [{
    name   : "On My Plate",
    script : "./dist/index.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
