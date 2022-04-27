const https = require("https");

function run() {
    let data = "";
    // https
    //     .get("https://www.reddit.com/r/SpaceForce/top/.json", (resp) => {
    //         console.log(resp);
    //     })
    //     .on("error", (err) => {
    //         console.log("Error: " + err.message);
    //     });
    https
        .get("https://www.military.com/space-force", (resp) => {
            console.log(resp);
        })
        .on("error", (err) => {
            console.log("Error: " + err.message);
        });
}

module.exports = { run };
