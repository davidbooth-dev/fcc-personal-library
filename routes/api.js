/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const find = require('../modules/db-module.js').find;
  const createOne = require('../modules/db-module.js').createOne;
  const deleteMany = require('../modules/db-module.js').deleteMany;
  const findById = require('../modules/db-module.js').findById;
  const addComment = require('../modules/db-module.js').addComment;
  const deleteComment = require('../modules/db-module.js').deleteComment;
  const deleteAllComments = require('../modules/db-module.js').deleteAllComments;
  const deleteOne = require('../modules/db-module.js').deleteOne;

  // Tests
  /*let title = 'The Dark';
  find(title , function (err, result) {
    console.log('test: ', result)
  })

  /*let title = 'The Dark';
  if (!title) console.log('test: ', []);
  else {
    createOne(title, function (err, result) {
      console.log('test: ', result)
    })
  }*/

  /*deleteMany(function (err, result) {
    console.log('test: ', err, result)
  })*/

  /*findById(id, function(err, result){
    console.log('test: ', err, result)
  }) */

  /*let id = '5f5756ee82198c392cf942d6';
  let comment = '';
  if (!id) console.log('test: ', 'No ID Sent');
  else if (!comment) console.log('No Comment Sent')
  else {
    addComment(id, comment, function (err, result) {
      console.log('test: ', err, result)
    })
  }*/

  /*let id = '5f5756ee82198c392cf942d6';
  if (!id) console.log('test: ', 'No ID Sent');
  else {
    deleteOne(id, function (err, result) {
      console.log('test: ', err, result)
    })
  }*/

  app.route('/api/books')
    /** getAllBooks */
    .get(function (req, res) {
      let data = req.body.title;
      find(data, function (err, result) {
        res.json(result);
      })
    })
    /** addNewBook */
    .post(function (req, res) {
      let title = req.body.title;
      if (!title) res.send([]);
      else {
        createOne(title, function (err, result) {
          if (err) res.send(err);
          else res.json(result);
        })
      }
    })
    /** deleteAllBooks*/
    .delete(function (req, res) {
      deleteMany(function (err, result) {
        if (err) res.send(err);
        else res.send(result);
      })
    });

  app.route('/api/books/:id')
    /** getBook */
    .get(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) res.send([]);
      else {
        findById(bookid, function (err, result) {
          if (err) res.send([]);
          else res.json(result);
        })
      }
    })
    /** addComment */
    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid) res.send('No ID Sent');
      else if (!comment) res.send('No Comment Sent');
      else {
        addComment(bookid, comment, function (err, result) {
          if (err) res.send(err);
          else res.json(result);
        });
      }
    })
    /** deleteBook */
    .delete(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) res.send('No ID Sent');
      else {
        deleteOne(bookid, function (err, result) {
          if (err) res.send(err);
          else res.send(result);
        });
      }
    });

  app.route('/api/books/:id/:comment')
    .delete(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) res.send('No ID Sent');
      let comment = req.params.comment;
      if (!comment) res.send('No Comment Sent');

      deleteComment(bookid, comment, function (err, result) {
        if (err) res.send(err);
        else res.send(result);
      });
    })
};
