//set global variables and requirments
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsutils');


//import express
const app = express();
//set Port to listen on
const PORT = process.env.PORT || 3001;

// set middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//set static 'public' folder
app.use(express.static('public'));

//set route for hompage
app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, "./public/index.html"))
);

//set route for notes page
app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, "./public/notes.html"))
);



//set route to GET request and read from db.json
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
      res.json(JSON.parse(data))
    );
  });

//set route to POST request and add note to database
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {

    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend (newNote, './db/db.json');
 
    const response = {
      status: 'successfully added note!',
      body: newNote,
    };

    res.json(response);

  } else {
    res.json('Oops, something went wrong.');
  }
});

// Delete previous saved notes.
app.delete('/api/notes/:id', (req, res) => {
    const noteid = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id !== noteid);
        writeToFile('./db/db.json', result);
        res.json(`Note ${noteid} has been deleted`);
      });
});

//set wildcard route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Have app listen on specified port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

  