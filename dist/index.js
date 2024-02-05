const fs = require('fs');
const child = require('child_process');

function InstallPackages() {
	console.log('You didn\'t install the required node packages first!')
	console.log('Please wait... starting to install all required node packages using child process')
	console.log('If the bot can\'t install the package please install it manually')
	try {
		child.execSync('npm i')
		console.log('Install complete!, please run "node index" command again!')
		process.exit()
	} catch (err) {
		console.log('Error! ', err)
		process.exit()
	}
}


if (fs.existsSync('./node_modules/crypto')) {
	console.log('All required node packages are installed, starting the bot...')
} else {
	InstallPackages()
}

const dotenv = require('dotenv').config();
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const crypto = require('crypto');
const sendToDiscord = require('./sendToDiscord.js');


//runs a server on port port and listens for a POST request to /webhook
const server = http.createServer((req, res) => {
	if (req.method === 'POST' && url.parse(req.url).pathname === '/webhook') {
		//blackmagic to get the body of the request for authentication
		let body = '';
		let decoder = new StringDecoder('utf-8');

		req.on('data', (data) => {
			body += decoder.write(data);
		});

		req.on('end', () => {
			body += decoder.end();

			const signature = req.headers['x-hub-signature'];
			const hmac = crypto.createHmac('sha1', `${process.env.WEBHOOK_SECRET}`);

			hmac.update(body);

			const computedSignature = `sha1=${hmac.digest('hex')}`;

			if (signature === computedSignature) {
				console.log('Valid signature');
				//if the signature is valid, send the data to discord
				sendToDiscord();

			} else {
				console.log('Invalid signature');
			}
			res.statusCode = 200;
			res.end('Data sent to Discord');
		});
	} else {
		res.statusCode = 404;
		res.end('Go away!');
	}
});

const port = process.env.WEB_SERVER_PORT; // Change this to the desired port number
server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});