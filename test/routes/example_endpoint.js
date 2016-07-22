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
		routeName: 'Albums',
		postObject: {
			general: {
				name: 'Ascot'
			},
			time: {
				startDate: new Date('Wed Apr 06 2016 21:51:15 GMT+0000 (UTC)')
			},
			type: "album"
		},
		expectedObjectAfterPost: {
			general: {
				name: 'Ascot'
			},
			time: {
				startDate: new Date('Wed Apr 06 2016 21:51:15 GMT+0000 (UTC)')
			},
			type: "album"
		},
		putObject: {
			general: {
				name: 'Ascot3'
			},
			time: {
				startDate: new Date('Wed Apr 07 2016 21:51:15 GMT+0000 (UTC)')
			},
			type: "album"
		},
		expectedObjectAfterPut: {
			general: {
				name: 'Ascot3'
			},
			time: {
				startDate: new Date('Wed Apr 07 2016 21:51:15 GMT+0000 (UTC)')
			},
			type: "album"
		},
	};

	e2e(testData, options);


})();
