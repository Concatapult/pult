require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest')
var routes = require('~/server/index')

describe("The Server", function() {

  var app = TestHelper.createApp()
  app.use('/', routes)
  app.testReady()

  it("serves an example endpoint", async function () {

    //
    // async / await functions are great for testing :)
    //
    await request(app)
      .get('/api/tags-example')
      .expect(200)
      .expect(function(response) {
        expect(response.body).to.include('node')
      })
  })
})
