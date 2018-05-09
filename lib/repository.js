//repo related functions like creating remote repo, running git command, etc.
//are written in this file

const _ = require('lodash');
const git = require('simple-git')();
const fs = require('fs');
const touch = require('touch');
const clui = require('clui');
const chalk = require('chalk');
const spinner = clui.Spinner;

const gh = require('./gitHelper');
const cmd = require('./cmdline');

module.exports = {
	createRemoteRepo: async () => {
		const octo = gh.getInstance(),
		answers = await cmd.askRepoDetails(),
		data = {
			name: answers.name,
			description: answers.description,
			private: answers.visibility === 'private'
		},
		status = new spinner('Creating new GitHub repository...');
		status.start();
		try {
			const resp = await octo.repos.create(data);
			return resp.data.ssh_url;
		}
		catch(error) {
			throw error;		
		}
		finally { status.stop(); }		
	},
	createIgnoreFile: async () => {
		const fileList = _.without(fs.readdirSync('.'), '.git', '.gitignore');
		if(fileList.length) {
			const answers = await cmd.askIgnoreFiles();
			if(answers.ignore.length) fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
			else touch('.gitignore');
		} else touch('.gitignore');
	},
	setupRepo: async (url) => {
		const status = new spinner('Setting up your repository...');
		status.start();
		
		try {
			await git.init().add('.gitignore').add('./*').commit('First commit').addRemote('origin', url).push('origin', 'master');
			return true;
		}
		catch(error) {
			throw error;
		}
		finally {
			status.stop();
		}
	}
}
