const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils.js');

notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const idReturn = json.filter((note) => note.id === noteID);
      return idReturn.length > 0 ? res.json(idReturn) : res.json("Can't find a note with that ID unfortunately.");
    })
    .catch((err) => console.error('So this happened: ', err));
});

notes.delete('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const idReturn = json.filter((note) => note.id !== noteID);
      writeToFile('./db/db.json', idReturn)
      res.json(`Note ${noteID} is gone forever now. No takesies backsies.`)
    })
    .catch((err) => console.error('Ummm, this happened though: ', err));
});

notes.post('/', (req, res) => {
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    readAndAppend(newNote, './db/db.json');
    res.json('Solid note, greatly appreciated.');
  } else {
    res.error("I don't know what happened, but it didn't work.");
  }
});

module.exports = notes
