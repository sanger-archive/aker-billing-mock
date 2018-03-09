var request = require('supertest');

describe('Billing Facade Mock', function () {
  var server;
  beforeEach(function () {
    server = require('../app');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  context('when obtaining the price for a module and cost code', function() {
    context('when module and cost code are right', function() {
      it('returns a price for the module', function(done) {
        request(server)
          .post('/price_for_module')
          .send({module: '1234', cost_code: 'S4567', product: 'Product'})
          .expect(200, {
            module: '1234', cost_code: 'S4567', product: 'Product', price: '9'
          }, done)
      })            
    })
    context('when module is invalid', function() {
      it('returns bad request error', function(done) {
        request(server)
          .post('/price_for_module')
          .send({module: 'x1234', cost_code: 'S4567', product: 'Product'})
          .expect(400, done)
      })      
    })
    context('when cost code is invalid', function() {
      it('returns bad request error', function(done) {
        request(server)
          .post('/price_for_module')
          .send({module: '1234', cost_code: 'S4567r', product: 'Product'})
          .expect(400, done)
      })      
    })
    context('when product name is invalid', function() {
      it('returns bad request error', function(done) {
        request(server)
          .post('/price_for_module')
          .send({module: '1234', cost_code: 'S4567', product: 'xProduct'})
          .expect(400, done)
      })      
    })    

  })
});
