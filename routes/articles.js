var e2e = require('../index');
var exp = require('express');
'use strict';

(() => {

	var options = {
		 timeout : 200,
		 api : exp,
		 endpointRoot : 'http://localhost:3000',
	}


	var testData = {
		routeName: 'Articles',
		countTest:false,
		searchTest:'q',
		displayTest: false,
		uploads:['megatron','banner'],
		postObject: {
			title: 'this is an article',
		},
		expectedObjectAfterPost: {
			title: 'this is an article',
		},
		expectedSlug: 'this-is-an-article',
		secondPostObject: {
			title: 'this is an article',
		},
		expectedSecondSlug: 'this-is-an-article-2',
		putObject: {
			title: 'this is an article too',
		},
		expectedObjectAfterPut: {
			title: 'this is an article too',
		}
	};

	e2e(testData,options);


})();
