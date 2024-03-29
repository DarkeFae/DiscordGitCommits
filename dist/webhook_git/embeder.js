const env = require('dotenv').config();
const template = require('./template.json');
const get = require('./git.js');

async function embed() {
	try {
		template.embeds = [];
		// Call the get function from git.js
		const response = await get(process.env.GIT_USERNAME, process.env.GIT_REPOSITORY);
		// regex to split the response into sections
		let sections = response.split(/\n(?=\[[^\]]+\])/gm);
		// split the sections into title and content
		let result = sections.map(section => {
			let splitIndex = section.indexOf(']') + 1;
			return [section.substring(0, splitIndex), section.substring(splitIndex)];
		});
		console.log(result)
		if (result[0][0] == '[ping]'){
			template.content = `# Weekly Changelog \n \n||<@&${process.env.ROLE}>||`;
			result.shift();
		}
		// create the embeds from the result
		for (var section in result) {
			template.embeds.push(
				{
					"title": `${result[section][0]}`,
					"color": process.env.COLOR,
					"fields": [
						{
							"name": "",
							"value": result[section][1].replaceAll('<done>', '<a:verified:1162750387112124446> ').replaceAll('<todo>', '<a:pending:1208550493693935676> ').replaceAll('<broke>', '<a:thisisfinefire:1204908327805649046> '),
							"inline": false
						}
					]
				}
			);
		}
		
		return template;
	}
	catch (err) {
		console.error(err)
	}
}
// Export the function
module.exports = embed;