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
    }
    return false;
}

module.exports = { checkForDuplicates };
