const chai = require("chai"); //Assertion library import
const chaiHttp = require("chai-http"); // for http integration testing
const expect = chai.expect
const baseUrl = "https://test-api-615.herokuapp.com" //base url where the routes are rooted

chai.use(chaiHttp);
describe("Server Test", function(){
//Test to check if server is live
it('server is live', function(done) {
        chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);

            done();
        });
    })
})
