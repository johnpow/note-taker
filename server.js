const express = require('express');
const path = require('path');
let db = require('./db/db_new')
const id = require('./helpers/id');
const PORT = process.env.PORT || 3001;

const app = express();

//magic line that serve all our front end
app.use(express.static('public'));

// take form data and attach each key
//turn into object and attach to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.get('/api/notes', (req,res) => {
    res.json(db);
})

app.post('/api/notes', (req,res) => {
    req.body.id = id();
    db.push(req.body)
    res.json(db);
})

app.delete('/api/notes/:id', (req,res) => {
    db = db.filter(object => {
        return object.id !== req.params.id;
    });
    res.json(db);
})


app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
