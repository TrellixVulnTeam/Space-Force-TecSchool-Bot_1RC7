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

module.exports = { checkForDuplicates, makeId };
