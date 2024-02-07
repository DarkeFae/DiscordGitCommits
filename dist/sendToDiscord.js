const dotenv = require('dotenv').config();
//const get = require('./git.js');
const fs = require('fs');
const https = require('https');
const embeder = require('./embeder.js');

async function sendToDiscord() {
	try {
		console.log(`role is ${process.env.ROLE}`)
		// calls the get function from git.js
		const data = JSON.stringify(await embeder());
		console.log(data)
		// setup the discord webhook
		const options = {
			hostname: 'discord.com',
			path: `/api/webhooks/${process.env.WEBHOOK_CHANNEL}/${process.env.WEBHOOK_TOKEN}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': data.length
			}
		};

		// actually send the data to discord
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

module.exports = sendToDiscord
