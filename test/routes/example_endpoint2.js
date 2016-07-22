const e2e = require('../index');
const app = require('express');

'use strict';

(() => {

	let options = {
		timeout: 200,
		api: app,
		apidoc: false,
		schemaDir: __dirname + `/../data/apischemas/`
	}


	let testData = {
		routeName: 'Articles',
		postObject: {
			title: 'this is an article',
		},
		expectedObjectAfterPost: {
			title: 'this is an article',
		},
		putObject: {
			title: 'this is an article too',
		},
		expectedObjectAfterPut: {
			title: 'this is an article too',
		}
	};

	e2e(testData, options);


})();
