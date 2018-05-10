#!/usr/bin/env node

//The trigger point of the application

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fileHelper = require('./lib/files');
const cmd = require('./lib/cmdline');
const gitHelper = require('./lib/gitHelper');
const repo = require('./lib/repository');

clear();
console.log(chalk.white(figlet.textSync('GitHub Init', {horizontalLayout: 'full'})));

//Check if current directory is already a git directory

const checkpwd = () => {
		if(fileHelper.isDirectory('.git')) {
		console.log(chalk.red('Your current working directory is already a git directory...'));
		process.exit();
	}
}

const run = async function() {
	creds = await cmd.askCred();
	console.log(creds);
}

const getGitToken = async () => {
	try {
		var token = gitHelper.getToken();
		if(token) return token;
		await gitHelper.setToken();
		token = await gitHelper.registerNewToken();
		return token;
	}
	catch (err) {
		console.log(err);
		throw err;
	}
}

const runApp = async () => {
	try {
		checkpwd();
		const token = await getGitToken();
		gitHelper.gitAuth(token);
		const url = await repo.createRemoteRepo();
		console.log(chalk.blue('The remote ssh url is -> ' + url))
		await repo.createIgnoreFile();
		const done = await repo.setupRepo(url);
		if(done) console.log(chalk.green('All Done!'));
	} catch (error) {
		if(error) {
			switch(error.code) {
				case 401:
					console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
            				break;
				case 422:
					console.log(chalk.red('There already exists a remote repository with the same name'));
            				break;
				default:
					console.log(error);
					break;
			}
		}		
	}
}

runApp();
