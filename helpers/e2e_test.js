// Plugin to perform a simple end to end test for a route
'use strict';

module.exports = (testData) => {


	const should = require('should');
	const request = require('supertest');
	const partial_compare = require('partial-compare');
	const sg = require('./helpers/schema_generator');

	const timeout = process.env.TEST_TIMEOUT;


	let _ids = [];
	let itemCounter = 0;
	let routeNameSingle = testData.routeName.slice(0, -1);
	let slug = '';
	let fileTypes = [];

	describe(
		`\n--------` +
		` ${testData.routeName} ` +
		`--------\n`,
		() => {

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
						sg('POST', `/${testData.routeName}`, `create a new ${routeNameSingle}`, testData.postObject, res.body);
						//push the _id to the id array to perform get/put requests later
						_ids.push(res.body._id);
						res.statusCode.should.be.eql(200);
						setTimeout(done, timeout);
					});
			});

			//**************************************************************
			//* Test GET on root
			//**************************************************************

			it(`Should return an array of ${testData.routeName}`, (done) => {
				request(api)
					.get(`/${testData.routeName}`)
					.auth('user', 'pass')
					.end((err, res) => {
						sg('GET', `/${testData.routeName}`, `return an array of ${testData.routeName}`, testData.postObject, res.body);
						itemCounter = res.body.length;
						res.body.should.be.an.Array;
						res.statusCode.should.be.eql(200);
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
						sg('GET', `/${testData.routeName}`, `Get one ${routeNameSingle}`, testData.postObject, res.body);
						res.body.should.be.an.Object;
						partial_compare(res.body, testData.expectedObjectAfterPost).should.be.true;
						res.statusCode.should.be.eql(200);
						//only when required to check for unique slugs
						if (testData.secondPostObject) {
							res.body.slug.should.eql(testData.expectedSlug)
						};
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
						sg('PUT', `/${testData.routeName}/${_ids[0]}`, `change a ${routeNameSingle}`, testData.putObject, res.body);
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
						res.body.should.be.an.Object;
						partial_compare(res.body, testData.expectedObjectAfterPut).should.be.true;
						res.statusCode.should.be.eql(200);
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
						sg('DELETE', `/${testData.routeName}/${_ids[0]}`, `remove a ${routeNameSingle}`, testData.putObject, res.body);
						res.statusCode.should.be.eql(200);
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
						res.body.length.should.be.eql(itemCounter - 1);
						res.statusCode.should.be.eql(200);
						setTimeout(done, timeout);
					});
			});



		});
};
