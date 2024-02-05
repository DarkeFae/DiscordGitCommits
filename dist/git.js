const dotenv = require('dotenv').config();
const { Octokit } = require('@octokit/core');
const https = require('https');

//Octokit is the github api wrapper
const octokit = new Octokit({
	auth: `${process.env.GIT_TOKEN}`
})
async function get(user, repo) {
	// gets the list of commits
	return new Promise(async (resolve, reject) => {
	const commit = await octokit.request('GET /repos/{owner}/{repo}/commits', {
		owner: user,
		repo: repo,
		auth: `${process.env.GIT_TOKEN}`
	})
	// works out the ref of the latest commit
	var commitsList = commit.data
	const first = Object.entries(commitsList[0])
	const ref = first[0][1]
	const commitData = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
		owner: user,
		repo: repo,
		ref: ref
	})
	
	// gets the file contents of the latest commit
	var commitFile = commitData.data["files"][0]
	const fileData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: user,
		repo: repo,
		path: commitFile.filename
	})

	// calls function for getting the file contents of the latest commit
	const output = await fileContents(fileData.data.download_url)
		.then((data) => {
			return data
		})
		.catch(err => console.error(err))

	//fileData.data.download_url


	resolve(output)
	})
}

// function for getting the file contents of the latest commit
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

// exports the get function for the main file
module.exports = get