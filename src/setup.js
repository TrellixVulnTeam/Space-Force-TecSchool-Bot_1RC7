require("dotenv").config();
const fs = require("fs");
const envfile = require("envfile");
const prompt = require("prompt-sync")({ sigint: true });

function run() {
	let array = [];
	array.push([process.env.TOKEN, "TOKEN"]);

	for (let index = 0; index < array.length; index++) {
		if (array[index][0] === undefined || array[index][1] == "") {
			let val = prompt(`Input ${array[index][1]} `);
			let file = fs.readFileSync("./.env", "utf-8");
			let parsedFile = envfile.parseFileSync(".env");
			let env = [];
			env = file.split("\n");
			val = `${array[index][1]}=${val}`;
			env.push(val);
			parsedFile.array[index][1] = env;
			fs.writeFileSync("./.env", envfile.stringifySync(parsedFile));
		}
	}
}

module.exports = { run };
