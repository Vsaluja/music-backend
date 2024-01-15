const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), './database/chinook.sqlite');
const db = Database(dbPath);
const Joi = require('joi');


// Artist

const artistSchema = Joi.object({
    Name: Joi.string().min(2).max(20).required()
})


// Adding Artist
router.post('/', (req, res)=>{
    // Need to validate the on coming data first
    const artistValidation = artistSchema.validate(req.body, {abortEarly: false});
    
    if(artistValidation.error){
        return res.status(422).send(artistValidation.error.details);
    }

    const statement = db.prepare('INSERT INTO  artists (Name) VALUES (?)');
    const result = statement.run(req.body.Name);

   result.changes > 0 ?  res.status(201).json(result) : res.status(404).json(result)
})

//  Get artist data to set inside the form in edit artist
router.get('/:id', (req, res)=>{
    const artistId = req.params.id;

    const statement = db.prepare("SELECT * FROM artists WHERE ArtistId = ?");
    const result = statement.get(artistId);

    res.status(200).json(result);
})

// Edit artist
router.patch('/:id', (req, res)=>{
    let artistId = req.params.id;
    const artistValidation = artistSchema.validate(req.body);   
    
    if(artistValidation.error){
        return res.status(422).send(artistValidation.error.details);
    }

     const statement = db.prepare("UPDATE artists SET Name = ? WHERE ArtistId = ?");
     const result = statement.run([req.body.Name, artistId]);

     result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})

// Delete Artist
router.delete('/:id', (req, res)=>{
    let artistId = req.params.id;
    
    const statement = db.prepare("DELETE FROM artists WHERE ArtistId = ?");
    const result = statement.run(artistId);

    result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})

module.exports = router;