const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsutils');


//set route to GET request and read from db.json
notes.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
      res.json(JSON.parse(data))
    );
  });

//set route to POST request and add note to database
notes.post('/api/notes', (req, res) => {
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
notes.delete('/api/notes/:id', (req, res) => {
    const noteid = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id !== noteid);
        writeToFile('./db/db.json', result);
        res.json(`Note ${noteid} has been deleted`);
      });
});