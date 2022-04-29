const https = require("https");

function run() {
    let data = "";
    // https
    //     .get("https://www.reddit.com/r/SpaceForce/top/.json", (resp) => {
    //         console.log(general.time+resp);
    //     })
    //     .on("error", (err) => {
    //         console.log(general.time+"Error: " + err.message);
    //     });
    https
        .get("https://www.military.com/space-force", (resp) => {
            console.log(general.time + resp);
        })
        .on("error", (err) => {
            console.log(general.time + "Error: " + err.message);
        });
}

module.exports = { run };
