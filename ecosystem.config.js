module.exports = {
    apps: [{
      script: "src/app.js",
      watch: true,
      // Delay between restart
      watch_delay: 10000,
      ignore_watch : ["/src/config"],
    }]
  }