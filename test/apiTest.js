
const chai = require("chai"); //Assertion library import
const chaiHttp = require("chai-http"); // for http integration testing
const expect = chai.expect
const baseUrl = "https://test-api-615.herokuapp.com" //base url where the routes are rooted
const express = require('express');
const router = express.Router();
let should = chai.should();



chai.use(chaiHttp);
//Grouping the tests --- Route tests
describe("Route tests", function(){
    //GET request test --- Get Collection Names   
    it('get collections names test', function(done) {
        chai.request(baseUrl)
        .get('/api/testDB/collections')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('array');

            
            done();

        });
    });
    //POST request test --- Create a New Collection
    it('create collections test', function(done) {
        let collection = {
            name: "Collection Test",
            date: "02/12/2020"
        }        
        chai.request(baseUrl)

        .post('/api/testDB/createCol/newCollection')
        .send(collection)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();

        });
    });
    //DELETE request test --- Delete a Specific Document from a Collection
    it('delete collection(specific document) test', function(done) {
       
        chai.request(baseUrl)
        .delete('/api/feedback/elVictor/demo-bias001/ParticipantID-2')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

        });
    });
    //DELETE request test --- Delete an Element in an Array in a Document
    it('delete collection test(element in an array, in document)', function(done) {
       
        chai.request(baseUrl)
        .delete('/api/feedback/elVictor/demo-bias001/ParticipantID-2/bias001normalcurve/Nigeria-10')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

        });
    });
    //DELETE request test --- Delete Multiple Collections
    it('delete collection test(all collections in a study)', function(done) {
       
        chai.request(baseUrl)
        .delete('/api/feedback/testDB/all')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

        });
    });
    //GET request test --- Get Documents from a Collection
    it('get documents test(from collection)', function(done) {
       
        chai.request(baseUrl)
        .get('/api/feedback/testDB/newCollection')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('array');

            
            done();

        });
    });
    //GET request test --- Get a Specific Document from a Collection
    it('get specific document test(from collection)', function(done) {
       
        chai.request(baseUrl)
        .get('/api/feedback/elvictor/demo-bias001/condition-001')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

        });
    });
    //POST request test --- Create a New Document in a Collection
    it('create a new document test(collection)', function(done) {
        let document = { "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}, {"2": "biubiubiu"}] }       
        chai.request(baseUrl)
        .post('/api/feedback/testDB/newCollection')
        .send(document)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

        });
    });
    //PUT request test --- Change the Content of a Document
    it('change the content of a document test(collection)', function(done) {
            chai.request(baseUrl)
            .put('/api/feedback/testDB/newCollection/name-StormTrooper')
            .send({name :"StormTrooper",
                    color: ["blue"]})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.body.should.be.a('object');

                
                done();

        });
    });
    //PUT request test --- Append to ann Array in a Document's Entry
    it('append to an array in a document entry test(collection)', function(done) {
 

        chai.request(baseUrl)
        .put('/api/feedback/testDB/newCollection/name-StormTrooper/color')
        .send({"name" :"StormTrooper",
              "color": [{"safe" :"blue"}, {"danger": "red"}]})
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

       });
    });
    //PUT request test --- Update an Elememt in an Array in a Document's Entry
    it('update an element in an array in a docoument entry test(collection)', function(done) {

        chai.request(baseUrl)
        .put('/api/feedback/testDB/newCollection/name-StormTrooper/acions/1-shoot/accuracy')
        .send({ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot", "accuracy": "30%"}] })
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

       });
    });
    //User Routes Test --- Login Test
    it('login user routes', function(done) {
 

        chai.request(baseUrl)
        .post('/api/login')
        .send({username:  "elVictor" ,
               password: "123456"})
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');

            
            done();

       });
    });

})
