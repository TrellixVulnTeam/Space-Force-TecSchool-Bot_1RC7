const fs = require("fs");

var date = new Date();
var time = `${date.toLocaleDateString()} ${date.toLocaleString("en-US", {
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

    fileExists: function (path, data, type) {
        if (!fs.existsSync(path)) {
            switch (type) {
                case "json":
                    fs.writeFileSync(
                        path,
                        JSON.stringify({
                            data,
                        })
                    );
                    break;
                case "txt":
                    fs.writeFileSync(path, data);
                    break;
                default:
                    fs.writeFileSync(path);
                    break;
            }
        }
    },
};
