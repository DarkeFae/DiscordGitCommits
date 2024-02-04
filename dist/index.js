const dotenv = require('dotenv').config();
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const crypto = require('crypto');
const sendToDiscord = require('./sendToDiscord.js');

const server = http.createServer((req, res) => {
	if (req.method === 'POST' && url.parse(req.url).pathname === '/webhook') {
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
				sendToDiscord();

			} else {
				console.log('Invalid signature');
			}
			res.statusCode = 200;
			res.end('Data sent to Discord');
		});
	} else {
		res.statusCode = 404;
		res.end('Not found');
	}
});

const port = 3000; // Change this to the desired port number
server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});