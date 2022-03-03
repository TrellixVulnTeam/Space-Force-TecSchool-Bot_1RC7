require("dotenv").config();
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
function run() {
	let array = [];
	array.push([process.env.TOKEN, "TOKEN"]);

	for (let index = 0; index < array.length; index++) {
		if (array[index][1] === undefined) {
			rl.question(`Input ${array[index][2]}`, function (val) {
				process.env.array[index][2] = val;
				rl.close();
			});

			rl.on("close", function () {
				console.log("\nBYE BYE !!!");
				process.exit(0);
			});
		}
	}
}

module.exports = { run };
