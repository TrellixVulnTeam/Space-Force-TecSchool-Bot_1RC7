const fs = require("fs");
const path = require("path");

var date = new Date();
var time = `> ${date.toLocaleDateString()} ${date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
})} --- `;

module.exports = {
    error: function (errorLevel, log) {
        let color = [
            "\x1b[32m%s\x1b[0m",
            "\x1b[33m%s\x1b[0m",
            "\x1b[31m%s\x1b[0m",
        ];
        let backgroundColor = [
            "\x1b[42m%s\x1b[0m",
            "\x1b[43m%s\x1b[0m",
            "\x1b[41m%s\x1b[0m",
        ];

        //log error in the console
        console.log(
            backgroundColor[errorLevel - 1],
            `${time}error level: ${errorLevel} `
        );
        console.log(color[errorLevel - 1], log);

        //get the json.log file
        if (!fs.existsSync(path.join(__dirname, "error.json"))) {
            fs.writeFileSync(path.join(__dirname, "error.json"), "[]");
        }
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
