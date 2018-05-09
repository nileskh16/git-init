//Questions about git credentials and repo details go in this file

const inquirer = require('inquirer');
const files = require('./files');
const minimist = require('minimist'),
_ = require('lodash'),
fs = require('fs'),
touch = require('touch');

const validator = (value) => {
	return value.length ? true : 'Enter the input value. Don\'t keep i blank ';
}, fileList = _.without(fs.readdirSync('.'), '.git', '.gitignore');

module.exports = {
	askCred: () => {
		const questions = [
			{
				type: 'input',
				name: 'username',
				message: 'Please enter gitHub username ',
				validate: (value) => {
					return (value.length) ? true : 'Please enter gitHub username'
				}
			},
			{
				type: 'password',
				name: 'password',
				message: 'Enter github password ',
				validate: (pass) => {
					return pass.length ? true : 'Plase don\'t keep password blank'
				}
			}
		];
		return inquirer.prompt(questions);
	},
	askRepoDetails: () => {
		const argv = minimist(process.argv.slice(2));
		const questions = [
			{
				name: 'name',
				type: 'input',
				message: 'Enter the name of the repository ',
				default: argv._[0] || files.getBasePath(),
				validate: validator
			},
			{
				name: 'description',
				type: 'input',
				message: 'Enter the description of the repository ',
				default: argv._[1] || null
			},
			{
				name: 'visibility',
				type: 'list',
				message: 'Public or Private: ',
				choices: ['public', 'private'],
				default: 'public'
			}	
		];
		return inquirer.prompt(questions);
	},
	askIgnoreFiles: () => {
		const questions = [
			{
				type: 'checkbox',
				name: 'ignore',
				message: 'Select files you want to ignore',
				choices: fileList,
				default: ['node_modules', 'bower_components']
			}
		];
		return inquirer.prompt(questions);
	}
}
