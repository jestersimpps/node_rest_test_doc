var e2e = require('../index');
var app = require('express');

'use strict';

(() => {

	var options = {
		 timeout : 200,
		 api : app,
	}


	var testData = {
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

	e2e(testData,options);


})();
