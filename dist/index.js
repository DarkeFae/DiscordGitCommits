const dotenv = require('dotenv').config();
const get = require('./git.js');
const fs = require('fs');
const https = require('https');

const REQUIRED_ENV_VARS = [
	"WEBHOOK_TOKEN",
	"WEBHOOK_CHANNEL",
	"ROLE",
	"GIT_USERNAME",
	"GIT_REPOSITORY",
	"GIT_TOKEN"
];

process.env.GITHUB_ACTION = process.env.GITHUB_ACTION || '<missing GITHUB_ACTION env var>';

REQUIRED_ENV_VARS.forEach(env => {
	if (!process.env[env] || !process.env[env].length) {
		console.error(
			`Env var ${env} is not defined. Maybe try to set it if you are running the script manually.`
		);
		process.exit(1);
	}
});

async function main() {
	try {
		console.log(process.env.ROLE)
		const response = await get(process.env.GIT_USERNAME, process.env.GIT_REPOSITORY)
		const changesTemp = response.split(/\[.*\]/gm)
		const changes = changesTemp.slice(1, changesTemp.length)
		for (i in changes) {
			changes[i] = changes[i].slice(0, -1)
			changes[i] = `${changes[i]}`.replace(/<done>/g, '\n<a:verified:1162750387112124446> ')

		}
		console.log(changes)
		const data = JSON.stringify(
			{
				"username": "Changelogs",
				"avatar_url": "",
				"content": `||<@&${process.env.ROLE}>||`,
				"embeds": [
					{
						"title": "GLOBAL",
						"color": 15258703,
						"fields": [
							{
								"name": "",
								"value": `${changes[0]}`,
								"inline": false
							}
						]
					},
					{
						"title": "DRAGONSPINE SMP",
						"color": 15258703,
						"fields": [
							{
								"name": "",
								"value": `${changes[1]}`,
								"inline": false
							}
						]
					},
					{
						"title": "MISC",
						"color": 15258703,
						"fields": [
							{
								"name": "",
								"value": `${changes[2]}`,
								"inline": false
							}
						]
					}
				]
			});

		const options = {
			hostname: 'discord.com',
			path: `/api/webhooks/${process.env.WEBHOOK_CHANNEL}/${process.env.WEBHOOK_TOKEN}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		const req = https.request(options, (res) => {
			let body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				console.log('Server response:', body);
			});
		});

		req.on('error', (error) => {
			console.error('Error:', error);
		});

		req.write(data);
		req.end();

	}
	catch (err) {
		console.error(err)
	}
}

main()
