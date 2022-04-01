module.exports = {
    apps: [{
      script: "src/app.js",
      watch: ["server", "client"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch : ["/src/config"],
    }]
  }