/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: 'text' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'comments', 'Should be a comment array')
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        }); 
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.equal(Array.isArray(res.body), Array.isArray([]));
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array');          
          assert.property(res.body[0], 'comments', 'Should be a comment array')
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = '000000000000';
        chai.request(server)
        .get(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array');
          assert.equal(Array.isArray(res.body), Array.isArray([]));

          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const id = '5f57ad058e0d2913a0b5a4ac';
        chai.request(server)
        .get(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books should contain id');

          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const id = '5f57ad058e0d2913a0b5a4ac';        
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({ comment: 'comment' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');

          done();
        });
      });
      
    });

    suite('POST /api/books/[id] => add comment', function(){
      
      test('Test POST /api/books/[id] with id/no comment', function(done){
        const id = '5f57ad058e0d2913a0b5a4ac';
        chai.request(server)
        .post(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.equal(res.text, 'No Comment Sent');

          done();
        });
      });
      
      test('Test POST /api/books/[id] with no id/comment', function(done){
        const id = '000000000000';
        chai.request(server)
        .post(`/api/books/${id}`)
        .send({
          comment: 'text'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.equal(res.text, 'Could Not Add Comment');

          done();
        });
      });
    });

    suite('DELETE /api/books/[id] => delete book', function(){

      test('Test DELETE /api/books/[id] with no id', function(done){
        const id = '000000000000';
        chai.request(server)
        .delete(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'failure')

          done();
        });
      });

      test('Test DELETE /api/books/[id] with id', function(done){
        const id = '5f57b451128deb3c98befb8e';
        chai.request(server)
        .delete(`/api/books/${id}`)
        .end(function(err, res){
          console.log('body: ', res.body);
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.equal(res.text, 'Delete Successful')

          done();
        });
      });
       
    });

    suite('DELETE /api/books => delete all books', function(){
      
      test('Test DELETE /api/books', function(done){
        chai.request(server)
        .delete('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.equal(res.text, 'Complete Delete Successful')

          done();
        });
      });
    });
  });

});
