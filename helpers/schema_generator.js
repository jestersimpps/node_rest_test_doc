// Plugin to pgenerate a schema
'use strict';

// sg(schema, 'GET', `/${testData.routeName}`, `return an array of ${testData.routeName}`, testData, res.body);
module.exports = (request_type, route, description, postObject, responseBody) => {

	const Type = require('type-of-is');
	const jsonfile = require('jsonfile');

	const schemaDir = __dirname + `/../data/apischemas/`;

	let properties = {};
	let required = [];
	let routeTitle = route.indexOf('/') > -1 ? route.split('/')[1].toString().toLowerCase() : route.toString().toLowerCase();
	let paramTitle = `${routeTitle.toUpperCase()+'-'+request_type+'-'+slugify(description)}-PARAMS`;
	let successTitle = `${routeTitle.toUpperCase()+'-'+request_type+'-'+slugify(description)}-SUCCESS`;


	//input params

	if (request_type == 'POST' || request_type == 'PUT') {
		let apiParams = {
			title: paramTitle,
			type: `${getType(postObject)}`,
			properties: {}
		}

		for (var property in postObject) {
			if (postObject.hasOwnProperty(property)) {
				apiParams.properties[property] = {
					description: `${getDescription(postObject[property])}`,
					type: `${getType(postObject[property])}`
				}
			}
		}

		jsonfile.writeFile(`${schemaDir}${paramTitle}.json`, apiParams, function (err) {
			err && console.error(err)
		})
	}


	//success params

	let apiSuccess = {
		title: successTitle,
		type: `${getType(responseBody)}`
	};

	switch (getType(responseBody)) {
	case 'array':
		apiSuccess.items = {
			title: description,
			type: "object",
			properties: {}
		};
		for (let property in responseBody[0]) {
			if (responseBody[0].hasOwnProperty(property)) {
				if (getType(responseBody[0][property]) == 'array') {
					apiSuccess.items.properties[property] = {
						title: `${getDescription(responseBody[0][property])}`,
						items: { type: "object", description: property },
						type: `array`,
						description: 'array of '
					}
				} else {
					apiSuccess.items.properties[property] = {
						description: `${getDescription(responseBody[0][property])}`,
						type: `${getType(responseBody[0][property])}`
					}
				}
			}
		};
		break;
	case 'object':
		apiSuccess.properties = {};
		for (let property in responseBody) {
			if (responseBody.hasOwnProperty(property)) {
				if (getType(responseBody[property]) == 'array') {
					apiSuccess.properties[property] = {
						title: `${getDescription(responseBody[property])}`,
						items: { type: "object", description: property },
						type: `array`,
						description: 'array of '
					}
				} else {
					apiSuccess.properties[property] = {
						description: `${getDescription(responseBody[property])}`,
						type: `${getType(responseBody[property])}`
					}
				}
			}
		};
		break;
	case 'number':
		break;
	case 'string':
		break;
	}


	jsonfile.writeFile(`${schemaDir}${successTitle}.json`, apiSuccess, function (err) {
		err && console.error(err)
	})


	//helper functions

	function slugify(text) {
		return text.toString().toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\-\-+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, ''); // Trim - from end of text
	}

	function getType(property) {
		return `${Type.string(property).toLowerCase()}`;
	}

	function getDescription(property) {
		return JSON.stringify(property);
	}


};
