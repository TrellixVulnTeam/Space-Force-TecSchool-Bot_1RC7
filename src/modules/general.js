const fs = require("fs");
const path = require("path");
const error = require(path.join(__dirname, "../modules/error/error"));

var date = new Date();
var time = `> ${date.toLocaleDateString()} ${date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
})} --- `;

module.exports = {
    time,
    checkForDuplicates: function (array) {
        let value = 0;
        for (let index = 0; index < array.length; index++) {
            for (let i = 0; i < array.length; i++) {
                if (array[i] == array[index]) {
                    value++;
                }
            }
            if (value > 1) {
                return true;
            }
            value = 0;
        }
        return false;
    },

    makeId: function (length) {
        let id = "";
        let R;
        for (let index = 0; index < length; index++) {
            R = Math.floor(Math.random() * 9);
            id = id + R;
        }
        return id;
    },

    fileExists: function (filePath, data, type) {
        if (!fs.existsSync(filePath)) {
            switch (type) {
                case "json":
                    try {
                        fs.writeFileSync(
                            filePath,
                            JSON.stringify({
                                data,
                            })
                        );
                    } catch (err) {
                        error.error(1, err);
                    }
                    break;
                case "txt":
                    try {
                        fs.writeFileSync(filePath, data);
                    } catch (err) {
                        error.error(1, err);
                    }
                    break;
                case "folder":
                    try {
                        fs.mkdirSync(filePath);
                    } catch (err) {
                        error.error(1, err);
                    }
                    break;
                default:
                    try {
                        fs.writeFileSync(filePath);
                    } catch (err) {
                        error.error(1, err);
                    }
                    break;
            }
        }
    },
};
