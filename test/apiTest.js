
const chai = require("chai"); //Assertion library import
const chaiHttp = require("chai-http"); // for http integration testing
const expect = chai.expect
const baseUrl = "https://test-api-615.herokuapp.com" //base url where the routes are rooted
const express = require('express');
let should = chai.should();



chai.use(chaiHttp);
//Grouping the tests --- Route tests
describe("Route tests", function(){
 
        //POST request test --- Create a New Collection
        it('create collections test', function(done) {
            
            chai.request(baseUrl)
    
            .post('/api/testDB/createCol/collection')
    
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                res.should.be.json;
        
    
    
    
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
                res.body.should.have.property('name');
                res.body.name.should.equal('StormTrooper');
    
                
                done();
    
            });
        });
        //PUT request test --- Change the Content of a Document
        it('change the content of a document test(collection)', function(done) {
            let document= {"type": "threshold"}
            chai.request(baseUrl)
            .put('/api/feedback/testDB/newCollection/studyName-Exp2')
            .send(document)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Entry with identifier {studyName: Exp2} updated.');
                res.should.be.json;
                
    
    
                
                done();
    
        });
    });
    //PUT request test --- Append to an Array in a Document's Entry
    it('append to an array in a document entry test(collection)', function(done) {
    
    
        chai.request(baseUrl)
        .put('/api/feedback/testDB/newCollection/name-StormTrooper/actions')
        .send({"name" :"StormTrooper",
              "actions": [{"3" :"tester"}]})
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
    //GET request test --- Get Collection Names   
    it('get collections names test', function(done) {
        chai.request(baseUrl)
        .get('/api/testDB/collections')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(4);
            res.body[0].should.equal('testCollections');
            res.body[1].should.equal('newCollection');
            res.body[2].should.equal('studyname-Exp2');
            res.body[3].should.equal('collection');

            
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
        res.body[1].should.be.a('object');
        res.body[1].should.have.property('name');
        res.body[1].name.should.equal('StormTrooper');
        
        

        
        done();

    });
});
//GET request test --- Get a Specific Document from a Collection
it('get specific document test(from collection)', function(done) {
   
    chai.request(baseUrl)
    .get('/api/feedback/testDB/newCollection/name-StormTrooper')
    .end(function (err, res) {
        expect(res).to.have.status(200);
        res.body.should.be.a('object');
        
        res.body.should.have.property('name');
        res.body.name.should.equal('StormTrooper');

        
        done();

    });
});


    //DELETE request test --- Delete an Element in an Array in a Document
    it('delete collection test(element in an array, in document)', function(done) {
       
        chai.request(baseUrl)
        .delete('/api/feedback/testDB/newCollection/name-StormTrooper/actions/1-shoot')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            res.body.should.be.a('object');


            
            done();

        });
    });
    //DELETE request test --- Delete a Specific Document from a Collection
    it('delete collection(specific document) test', function(done) {
       
        chai.request(baseUrl)
        .delete('/api/feedback/testDB/newCollection/name-StormTrooper')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            

            
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
            res.should.be.json
            
            
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