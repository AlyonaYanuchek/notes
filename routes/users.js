var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', (req, res, next) => {
  res.render('noteedit',{
    title: "Add a Note",
    docreate: true,
    notekey: "",
    note: undefined
  });
});

router.post('/save', (req, res, next) => {
  var p;
  if(req.body.docreate === "create"){
    p = notes.create(req.body.notekey, req.body.title, req.body.body);
  } else{
    p = notes.update(req.body.notekey, req.body.title, req.body.body);
  }
  p.then(note => {
        res.redirect('/notes/view?key=' + req.body.notekey);
      })
      .catch(err => { next(err); });
});

router.get('/view', (req, res, next) => {
  notes.read(req.query.key)
      .then(note => {
        res.render('noteview', {
          title: note ? note.title : "",
          notekey: req.query.key,
          note: note
        });
      })
      .catch(err => { next(err); });
});

module.exports = router;
