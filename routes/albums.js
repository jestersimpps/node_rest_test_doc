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
		routeName: 'Albums',
		countTest: true,
		searchTest: 'q',
		displayTest: false,
		uploads: ['avatar', 'megatron', 'advertisement', 'banner', 'logos', 'document', 'entriedocument'],
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
		expectedSlug: null,
		secondPostObject: null,
		expectedSecondSlug: null,
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

	e2e(testData,options);


})();
