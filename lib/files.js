//This file contains basic file management related utility functions

const fs = require('fs');
const path = require('path');

module.exports = {
	getBasePath: () => {
		return path.basename(process.cwd());
	},

	isDirectory: (filePath) => {
		try {
			return fs.statSync(filePath).isDirectory();
		}
		catch(error) {
			return false;
		}
	}
}
