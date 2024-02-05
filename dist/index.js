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