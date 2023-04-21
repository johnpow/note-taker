const express = require('express');
const path = require('path');
let db = require('./db/db')
const id = require('./helpers/id');
const PORT = process.env.PORT || 3001;
const fs = require('fs');

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
  fs.readFile('./db/db.json', 'utf8', (err, notes) => {
    if (err) {
      return res.status(500).json({err});
    }

    res.json(JSON.parse(notes));
  });

})

app.post('/api/notes', (req,res) => {

  fs.readFile('./db/db.json', 'utf8', (err, notes) => {
    //  check for errors if any happened
    if (err) {
      return res.status(500).json({err});
    }

    const data = JSON.parse(notes);
    //  add data to the array from users.json file

    req.body.id = id();
    data.push(req.body)
    //  write the new array to the users.json file
    fs.writeFile('./db/db.json', JSON.stringify(data, null, 2), (err) => {

      if (err) {
        return res.status(500).json({err});
      }
        //  send newly added data to the front-end
      res.json(JSON.parse(notes));
    });


  });

})

app.delete('/api/notes/:id', (req,res) => {

  fs.readFile('./db/db.json', 'utf8', (err, notes) => {
    //  check for errors if any happened
    if (err) {
      return res.status(500).json({err});
    }

    let data = JSON.parse(notes);
    //  add data to the array from users.json file


     data = data.filter(object => {
      return object.id !== req.params.id;
    });

    //  write the new array to the users.json file
    fs.writeFile('./db/db.json', JSON.stringify(data, null, 2), (err) => {

      if (err) {
        return res.status(500).json({err});
      }
        //  send newly added data to the front-end
      res.json(JSON.parse(notes));
    });


  });



})


app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))
