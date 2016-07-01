// Plugin to generate api schema
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

	if (request_type === 'POST' || request_type === 'PUT') {
		let apiParams = {
				title: paramTitle,
				type: `${getType(postObject)}`,
				properties: getObject(postObject)
			}
			//read file to see if changes
		jsonfile.readFile(`${schemaDir}${paramTitle}.json`, function (err, obj) {
			//if file doesnt exist
			if (err) {
				jsonfile.writeFile(`${schemaDir}${paramTitle}.json`, apiParams, function (err) {
					err && console.error(err)
				})
			}
		})

	}


	//success params

	if (responseBody) {
		let apiSuccess = {
			title: successTitle,
			type: `${getType(responseBody)}`
		};

		switch (getType(responseBody)) {
		case 'array':
			apiSuccess.items = {
				title: description,
				type: "object",
				properties: getArray(responseBody)
			};
			break;
		case 'object':
			apiSuccess.properties = getObject(responseBody);
			break;
		case 'number':
			apiSuccess.description = "a number";
			break;
		case 'string':
			apiSuccess.description = "a string";
			break;
		}
		//read file to see if changes
		jsonfile.readFile(`${schemaDir}${successTitle}.json`, function (err, obj) {
			//if file doesnt exist
			if (err) {
				jsonfile.writeFile(`${schemaDir}${successTitle}.json`, apiSuccess, function (err) {
					err && console.error(err)
				})
			}
		})

	}



	//helper functions

	function getArray(array) {
		let schema = {};
		for (let property in array[0]) {
			if (array[0].hasOwnProperty(property)) {
				if (getType(array[0][property]) === 'array') {
					schema[property] = {
						title: `${getDescription(array[0][property])}`,
						items: { type: "object", description: getDescription(property) },
						type: `array`,
						description: 'array of '
					}
				} else {
					schema[property] = {
						description: `${getDescription(array[0][property])}`,
						type: `${getType(array[0][property])}`
					}
				}
			}
		}
		return schema;
	}

	function getObject(object) {
		let schema = {};
		for (let property in object) {
			if (object.hasOwnProperty(property)) {
				if (getType(object[property]) === 'array') {
					schema[property] = {
						title: `${getDescription(object[property])}`,
						items: { type: "object", description: getDescription(property) },
						type: `array`,
						description: 'array of '
					}
				} else {
					schema[property] = {
						description: `${getDescription(object[property])}`,
						type: `${getType(object[property])}`
					}
				}
			}
		}
		return schema;
	}

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
		if (getType(property) === 'object') {
			return JSON.stringify(property, null, 2);
		}
		return property;
	}





};
