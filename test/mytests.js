const request = require('supertest');
const rewire = require('rewire');
const fs = require('fs');
const util = require('util');
const expect = require('chai').expect;
require('locus');

process.env.PORT = 1267;
const app = require('../restfulExpressServer');

let localData;
let readFile = util.promisify(fs.readFile);
const newPet = { "name": "Cornflake", "age": 3, "kind": "parakeet" };

beforeEach(() => {
	return readFile('./pets.json')
		.then(data => {
			return JSON.parse(data);
		})
		.then(data => {
			localData = data;
		});
});

describe('Is Mocha even working?', () => {
	it(`<= Let's hope so`, () => {
		expect(1).to.be.equal(1);
	});
});

describe('GET tests', () => {
	it(`Generic '/pets' should return should be all pets (code 200, type JSON)`, done => {
		request(app)
			.get('/pets')
			.expect(200)
			.expect('Content-type', /json/)
			.then(response => {
				expect(JSON.stringify(response.body)).to.equal(JSON.stringify(localData));
				return response;
			})
			.catch(err => {
				console.error(err);
			});
		done();
	});
	it(`'Pets/:ID' should return should be pet at ID (code 200, type JSON)`, done => {
		request(app)
			.get('/pets')
			.expect(200)
			.expect('Content-type', /json/)
			.then(response => {
				expect(JSON.stringify(response.body[3])).to.equal(JSON.stringify(localData[3]));
				return response;
			})
			.catch(err => {
				console.error(err);
			});
		done();
	});
});

// TODO: remove added data
describe('POST tests', () => {
	it(`A POST call to /pets with a proper body should create a new pet entry`, (done) => {
		request(app)
			.post('/pets')
			.type('application/json')
			.send(JSON.stringify(newPet))
			.expect(200)
			.expect('Content-type', /json/)
			.expect(JSON.stringify(newPet))
			.then((response) => {
				request(app)
					.get('/pets/2')
					.set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
					.expect('Content-Type', /json/)
					.expect(200, {
						age: 3,
						kind: 'parakeet',
						name: 'Cornflake'
					}, done);
			})
			.catch(done);
	});
});
