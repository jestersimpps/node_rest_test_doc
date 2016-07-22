// Plugin to perform a simple end to end test for a route
'use strict';


/**
 * This file contains the code that will perform end to end tests based on testData objects defined in the ./test/routes folder.
 * it will perform simple 200 tests as well as comparative tests between the response bodies and
 * the expectedObjectAfterPost / expectedObjectAfterPut objects defined in the testData object.
 * A counter keeps track of the amount of documents being created or removed in/from the db.
 * Finally, theres a custom GET test for an endpoint that can be defined in the testData object
 */

module.exports = (testData, options) => {


	const should = require('should');
	const request = require('supertest');
	const partial_compare = require('partial-compare');
	const sg = require('./schema_generator');

	const api = options.api;
	const timeout = options.timeout;
	const schemas = options.apidoc;

	let _ids = [];
	let routeNameSingle = testData.routeName.slice(0, -1);
	let slug = '';
	let fileTypes = [];

	describe(
		`\n--------` +
		` ${testData.routeName} tests ` +
		`--------\n`,
		() => {


			let itemCounter = 0;

			//**************************************************************
			//* Test GET on root
			//**************************************************************

			it(`Should return an array of ${testData.routeName}`, (done) => {
				request(api)
					.get(`/${testData.routeName}`)
					.auth('user', 'pass')
					.end((err, res) => {
						schemas && sg('GET',
							`/${testData.routeName}`,
							`return an array of ${testData.routeName}`,
							testData.postObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						let count = parseInt(res.body.length);
						itemCounter = count;
						console.log(`Counting ${testData.routeName}: ${count}`);
						res.body.should.be.an.Array;
						setTimeout(done, timeout);
					});
			});



			//**************************************************************
			//* Test POST request
			//**************************************************************

			testData.postObject && it(`Should create a new ${routeNameSingle}`, (done) => {
				request(api)
					.post(`/${testData.routeName}`)
					.auth('user', 'pass')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.send(testData.postObject)
					.end((err, res) => {
						schemas && sg('POST',
							`/${testData.routeName}`,
							`create a new ${routeNameSingle}`,
							testData.postObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						//push the _id to the id array to perform get/put requests later
						_ids.push(res.body._id);
						//increment itemcounter for array counter after DELETE request
						itemCounter++;
						console.log(`Adding: 1 ${routeNameSingle}`);
						setTimeout(done, timeout);
					});
			});

			//**************************************************************
			//* Test GET single ID after POST request
			//**************************************************************

			testData.expectedObjectAfterPost && it(`Should get the new ${routeNameSingle}`, (done) => {
				request(api)
					.get(`/${testData.routeName}/${_ids[0]}`)
					.auth('user', 'pass')
					.end((err, res) => {
						schemas && sg('GET',
							`/${testData.routeName}`,
							`Get one ${routeNameSingle}`,
							testData.postObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						res.body.should.be.an.Object;
						partial_compare(res.body, testData.expectedObjectAfterPost).should.be.true;
						//only when required to check for unique slugs
						if (testData.secondPostObject) {
							res.body.slug.should.eql(testData.expectedSlug)
						};
						setTimeout(done, timeout);
					});
			});


			//**************************************************************
			//* Test GET on root
			//**************************************************************

			it(`Should return an array of ${testData.routeName} with the correct size`, (done) => {
				request(api)
					.get(`/${testData.routeName}`)
					.auth('user', 'pass')
					.end((err, res) => {
						schemas && sg('GET',
							`/${testData.routeName}`,
							`return an array of ${testData.routeName}`,
							testData.postObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						let count = parseInt(res.body.length);
						console.log(`Counting ${testData.routeName}: ${count}, should be: ${itemCounter}`);
						count.should.be.eql(itemCounter);
						res.body.should.be.an.Array;
						setTimeout(done, timeout);
					});
			});


			//**************************************************************
			//* Change object in database using PUT
			//**************************************************************

			testData.putObject && it(`Should change a ${routeNameSingle}`, (done) => {
				request(api)
					.put(`/${testData.routeName}/${_ids[0]}`)
					.auth('user', 'pass')
					.send(testData.putObject)
					.end((err, res) => {
						schemas && sg('PUT',
							`/${testData.routeName}/${_ids[0]}`,
							`change a ${routeNameSingle}`,
							testData.putObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						setTimeout(done, timeout);
					});
			});


			//**************************************************************
			//* Test get after PUT to see if object was actually changed
			//**************************************************************

			testData.expectedObjectAfterPut && it(`Should get the changed ${routeNameSingle}`, (done) => {
				request(api)
					.get(`/${testData.routeName}/${_ids[0]}`)
					.auth('user', 'pass')
					.end((err, res) => {
						res.statusCode.should.be.eql(200);
						res.body.should.be.an.Object;
						partial_compare(res.body, testData.expectedObjectAfterPut).should.be.true;
						setTimeout(done, timeout);
					});
			});

			//**************************************************************
			//* Test DELETE request
			//**************************************************************


			testData.putObject && it(`Should remove a ${routeNameSingle}`, (done) => {
				request(api)
					.delete(`/${testData.routeName}/${_ids[0]}`)
					.auth('user', 'pass')
					.end((err, res) => {
						schemas && sg('DELETE',
							`/${testData.routeName}/${_ids[0]}`,
							`remove a ${routeNameSingle}`,
							testData.putObject,
							res.body,
							options.schemaDir
						);
						res.statusCode.should.be.eql(200);
						//decrement itemcounter for array counter after DELETE request
						itemCounter--;
						console.log(`Removing: 1 ${routeNameSingle}`);
						setTimeout(done, timeout);
					});
			});

			//**************************************************************
			//* Test get against number of records after DELETE
			//**************************************************************

			testData.putObject && it(`Should get an array without the deleted ${routeNameSingle}`, (done) => {
				request(api)
					.get(`/${testData.routeName}`)
					.auth('user', 'pass')
					.end((err, res) => {
						res.statusCode.should.be.eql(200);
						let count = parseInt(res.body.length);
						console.log(`Counting ${testData.routeName}: ${count}, should be: ${itemCounter}`);
						count.should.be.eql(itemCounter);
						setTimeout(done, timeout);
					});
			});

			//**************************************************************
			//* Test custom GET
			//**************************************************************

			testData.customTest && it(`Should return 200 for ${testData.routeName}/${testData.customTest}`, (done) => {
				request(api)
					.get(`/${testData.routeName}/${testData.customTest}`)
					.auth('user', 'pass')
					.end((err, res) => {
						res.statusCode.should.be.eql(200);
						setTimeout(done, timeout);
					});
			});


		});
};
