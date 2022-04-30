const fs = require("fs");
const path = require("path");
const general = require(path.join(__dirname, "../general"));

module.exports = {
    error: function (errorLevel, log) {
        //log error in the console
        console.log(`${general.time}error level: ${errorLevel}\n${log}`);

        //get the json.log file
        let json = fs.readFileSync(path.join(__dirname, "error.json"));

        //check the length and add error to log
        json = JSON.parse(json);
        json = checkLength(json);
        json.push({ level: errorLevel, error: log });
        json = JSON.stringify(json, null, 4);

        //write json file
        fs.writeFileSync(path.join(__dirname, "error.json"), json);
    },
};

function checkLength(json) {
    //remove logs until length is 39
    while (json.length >= 40) {
        json.shift();
    }
    return json;
}
