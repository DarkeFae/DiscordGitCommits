const https = require('https')
const data = JSON.stringify(
	{
		"username": "Changelogs",
		"avatar_url": "",
		"content": "",
		"embeds": [
			{
				"title": "a",
				"description": "a",
				"url": "https://discordapp.com",
				"color": 15258703,
				"fields": [
					{
						"name": "GLOBAL",
						"value": ``,
						"inline": false
					},
					{
						"name": "DRAGONSPINE SMP",
						"value": ``,
						"inline": false
					},
					{
						"name": "MISC",
						"value": ``,
						"inline": false
					}
				]
			}
		]
	});

const options = {
	hostname: 'discord.com',
	path: '/api/webhooks/1202889710616313877/nTGmR0RCW62WkWRtMnrcS2TGH1Q56qWsgGrA86YOp8hhsiZEIHjoV6DON-six-_p_CKt',
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