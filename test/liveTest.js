const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect
const baseUrl = "https://test-api-615.herokuapp.com"

chai.use(chaiHttp);
describe("Server Test", function(){
it('server is live', function(done) {
        chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.text).to.equal("Use /api/feedback/collection_name/some_userID");
            done();
        });
    })
})