const dotenv = require('dotenv').config();
const { Octokit } = require('@octokit/core');
const https = require('https');

const octokit = new Octokit({
	auth: `${process.env.GIT_TOKEN}`
})
async function get(user, repo) {
	return new Promise(async (resolve, reject) => {
	const commit = await octokit.request('GET /repos/{owner}/{repo}/commits', {
		owner: user,
		repo: repo
	})
	var commitsList = commit.data
	const first = Object.entries(commitsList[0])
	const ref = first[0][1]
	const commitData = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
		owner: user,
		repo: repo,
		ref: ref
	})
	//console.log(commitData.data)
	var commitFile = commitData.data["files"][0]
	//console.log(commitFile.filename)

	const fileData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: user,
		repo: repo,
		path: commitFile.filename
	})

	const output = await fileContents(fileData.data.download_url)
		.then((data) => {
			return data
		})
		.catch(err => console.error(err))

	//fileData.data.download_url


	resolve(output)
	})
}

function fileContents(url) {
	return new Promise((resolve, reject) => {
	https.get(url, (res) => {
		let fileContent = ''

		res.on('data', (chunk) => {
			fileContent += chunk
		})

		res.on('end', () => {
			resolve(fileContent)
		})

		res.on('error', (err) => {
			reject(err)
		})
	})
})
}

//get(process.env.GIT_USERNAME, process.env.GIT_REPOSITORY)
//	.catch(err => console.error(err))

module.exports = get