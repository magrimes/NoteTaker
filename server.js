const express = require("express");
const path = require("path");
const fs = require("fs")
const db = require("./db/db.json")
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/api/notes', function (req, res) {
    return res.json(db);
});

app.post('/api/notes', function (req, res) {
    const note = req.body
    if (db.length == 0) {
        note.id = 1
    } else {
        note.id = db[db.length - 1].id + 1
    }

    db.push(note)
    const temp = db
    console.log(db)
    fs.writeFile('./db/db.json', JSON.stringify(temp), (results, err) => {
        if (err) console.log(err)
        res.json(results)
    })
})
app.delete('/api/notes/:id', function (req, res) {
    console.log(req.params.id, '<======')
    const removeLocation = db.findIndex(location => location.id === parseInt(req.params.id))

    db.splice(removeLocation, 1)
    fs.writeFile('./db/db.json', JSON.stringify(db), (results, err) => {
        if (err) throw err
        res.sendStatus(200)
    })
})

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});