const express = require('express');
const app = express();
const Datastore = require('@google-cloud/datastore');

const projectId = 'chrome-plateau-178520';
// Must set ENVVAR "$GOOGLE_APPLICATION_CREDENTIALS"
// export GOOGLE_APPLICATION_CREDENTIALS='/path/to/key'
const datastore = Datastore({
  projectId: projectId
});

// The Cloud Datastore key for the new entity
app.get('/', function(req, res) {
   console.log('  GET 200 /');
   res.send('green');
});

app.get('/bible-books/:num', function(req, res) {
   console.log('  GET 200 /bible-books/' + req.params.num);
   const num = req.params.num;
   const query = datastore.createQuery('BibleBook').filter('BookOrderNumber', parseInt(num)).limit(1);
   datastore.runQuery(query, function(err, row) {
      if (row && row.length > 0) {
         const book = {
            name: row[0].BookName,
            chapters: row[0].ChapterCount,
            bookNum: row[0].BookOrderNumber,
            writtenLang: row[0].WrittenLanguage
         }
         res.send(book);
      }
   });
});

app.get('/bible-books', function(req, res) {
   console.log('  GET 200 /bible-books');
   const query = datastore.createQuery('BibleBook').limit(66).order('BookOrderNumber');
   datastore.runQuery(query, function(err, rows) {
      var books = rows.map(function(row) {
         return {
            name: row.BookName,
            chapters: row.ChapterCount,
            bookNum: row.BookOrderNumber,
            writtenLang: row.WrittenLanguage
         }
      });
      res.send(books);
   });
});

app.listen(8080, function() {
   console.log("Listening on localhost:8080");
});