const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), './database/chinook.sqlite');
const db = Database(dbPath);
const Joi = require('joi');


const albumSchema = Joi.object({
    Title: Joi.string().min(3).max(20).required(),
    ArtistId: Joi.number().integer(),
    ReleaseYear: Joi.number().integer().min(1800).max(2024)
})

// Add new Album
router.post('/', (req, res)=>{
    const albumValidation = albumSchema.validate(req.body, {abortEarly: false})
    
    if(albumValidation.error){
        return res.status(422).send(albumValidation.error.details);
    }

    const statement = db.prepare("INSERT INTO albums (Title, ArtistId, ReleaseYear) VALUES (?, ?, ?)");
    const result = statement.run([req.body.Title,  req.body.ArtistId, req.body.ReleaseYear]);

    console.log(result);
    result.changes > 0 ?  res.status(201).json(result) : res.status(404).json(result)
})

// Get albums to set inside the form in edit album
router.get('/:id', (req, res)=>{
    const albumId = req.params.id;

    const statement = db.prepare("SELECT * FROM albums WHERE AlbumId = ?");
    const result = statement.get(albumId);

    res.status(200).json(result);
})


// Edit album

router.patch('/:id', (req, res)=>{
    const albumId = req.params.id;
    const albumValidation = albumSchema.validate(req.body, {abortEarly: false});    
    


    if(albumValidation.error){
        return res.status(422).send(albumValidation.error.details);
    }

    const statement = db.prepare("UPDATE albums SET (Title, ReleaseYear) = (?, ?) WHERE AlbumId = ?");
    const result = statement.run([req.body.Title, req.body.ReleaseYear, albumId]);
    
    console.log(result);
    result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})


// Delete album

router.delete('/:id', (req, res)=>{
    let albumId = req.params.id;
    
    const statement = db.prepare("DELETE FROM albums WHERE AlbumId = ?");
    const result = statement.run(albumId);

    result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})

module.exports = router;