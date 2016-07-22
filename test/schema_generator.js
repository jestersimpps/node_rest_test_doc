// Plugin to generate api schema
'use strict';

/**
 * This schema generator will work in conjunction with the apidoc npm package and its apidoc-plugin-schema plugin.
 * It will be triggered in the e2e_test file in the callbacks of some of the request tests.
 * In the routes files you will find the apidoc generation comments above every request.
 * The apidoc generator uses these comments to generate files in the ./public folder that holds the UI for the documentation.
 * (configure this folder in the apidoc.json)
 * Because listing all the input and success parameters in comments above the routes is hard work and takes a lot of space,
 * we can reference the schema files using the apidoc-plugin-schema plugin.
 * The apidoc-schema-plugin takes schema json files as inputs and generates apidoc documentation accordingly.
 * Of course we would still need to create the schema files..
 *
 * This generator uses the testData object that is also used to perform the end to end test as an input to automatically generate
 * a schema file describing the input parameters and the response from the request to generate a file containing the success parameters.
 *
 * These files will be written to the schemaDir folder.
 *
 *
 */


// sg(schema, 'GET', `/${testData.routeName}`, `return an array of ${testData.routeName}`, testData, res.body);
module.exports = (request_type, route, description, postObject, responseBody,schemaDir) => {

	const Type = require('type-of-is');
	const jsonfile = require('jsonfile');

	let properties = {};
	let required = [];
	let routeTitle = route.indexOf('/') > -1 ? route.split('/')[1].toString().toLowerCase() : route.toString().toLowerCase();
	let paramTitle = `${routeTitle.toUpperCase()+'-'+request_type+'-'+slugify(description)}-PARAMS`;
	let successTitle = `${routeTitle.toUpperCase()+'-'+request_type+'-'+slugify(description)}-SUCCESS`;


	/**
	 * input params
	 *
	 * don't create input schema json for GET requests
	 * @param  {string} request_type === 'POST' || request_type === 'PUT' description
	 */
	if (request_type === 'POST' || request_type === 'PUT') {
		let apiParams = {
			title: paramTitle,
			type: `${getType(postObject)}`,
			properties: getObject(postObject)
		}

		jsonfile.writeFile(`${schemaDir}${paramTitle}.json`, apiParams, function (err) {
			err && console.error(err)
		})

	}


	/**
	 * success params
	 *
	 * check if responseBody is given,
	 * generate the json containing the success schema params
	 * @param  {object} responseBody res.body
	 */
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

		jsonfile.writeFile(`${schemaDir}${successTitle}.json`, apiSuccess, function (err) {
			err && console.error(err)
		})

	}


	/**
	 * getArray
	 *
	 * schema for array properties
	 * @param  {array} array description
	 * @return {object}       schema
	 */
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



	/**
	 * getObject
	 *
	 * schema for object properties
	 * @param  {object} object description
	 * @return {object}        schema
	 */
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


	/**
	 * slugify
	 *
	 * creates slugs from input text
	 * @param  {string} text input
	 * @return {string}      slug
	 */
	function slugify(text) {
		return text.toString().toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\-\-+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, ''); // Trim - from end of text
	}


	/**
	 * getType
	 *
	 * returns lowcase type of input variable
	 * @param  {any} property input variable
	 * @return {string}          type string
	 */
	function getType(property) {
		return `${Type.string(property).toLowerCase()}`;
	}



	/**
	 * getDescription
	 *
	 * returns stringified json beautified
	 * @param  {object} property input object
	 * @return {string}          pretty json string
	 */
	function getDescription(property) {
		if (getType(property) === 'object') {
			return JSON.stringify(property, null, 2);
		}
		return property;
	}





};
