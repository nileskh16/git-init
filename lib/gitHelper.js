//This file has the logic to handle git account and rest APIS

const octokit = require('@octokit/rest')();
const config = require('configstore');
const chalk = require('chalk');
const _ = require('lodash');
const clui = require('clui');
const spinner = clui.Spinner;
const cmd = require('./cmdline');
const pkg = require('../package.json');
const conf = new config(pkg.name);

module.exports = {
	getInstance: () => {
		return octokit;
	},
	gitAuth: (token) => {
		octokit.authenticate({type: 'oauth', token: token});
	},
	getToken: () => {
		return conf.get('github.token');
	},
	setToken : async () => {
		const credentials = await cmd.askCred();
		octokit.authenticate(_.extend({type: 'basic'}, credentials));		
	},
	registerNewToken: async () => {
		const status = new spinner('Authenticating your credentials...');
		status.start();
		try {
			const resp = await octokit.authorization.create({
				scopes: ['user', 'public_repo', 'repo', 'repo:status'],
				note: 'git-init tool for initializing git repo...'		
			});
			const token = resp.data.token;
			if(token) { conf.set('github.token', token); return token; }
			else throw new Error('Missing token', 'The token is missing from the response');		
		}
		catch(error) {
			throw error;
		}
		finally {
			status.stop();
		}
	}
}
