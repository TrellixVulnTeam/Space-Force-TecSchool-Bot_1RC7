const path = require("path");
const fs = require("fs");

function checkForDuplicates(array) {
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
}

function makeId(length) {
    let id = "";
    let R;
    for (let index = 0; index < length; index++) {
        R = Math.floor(Math.random() * 9);
        id = id + R;
    }
    return id;
}

function fileExists(path, data, type) {
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
}

module.exports = { checkForDuplicates, makeId, fileExists };
