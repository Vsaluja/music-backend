const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), './database/chinook.sqlite');
const db = Database(dbPath);
const Joi = require('joi');

const trackSchema = Joi.object({
    Name: Joi.string().max(20).required(),
    MediaTypeId: Joi.number().integer().required(),
    AlbumId: Joi.number().integer().required(),
    Milliseconds: Joi.number().integer().min(60000).required()
})

// Add new track
router.post('/', (req, res)=>{
    const trackValidation = trackSchema.validate(req.body, {abortEarly: false});

    if(trackValidation.error){
        return res.status(422).send(trackValidation.error.details);
    }

    const statement = db.prepare("INSERT INTO tracks (Name, AlbumId, MediaTypeId, Milliseconds) VALUES (?,?,?,?)");
    const result = statement.run([req.body.Name, req.body.AlbumId, req.body.MediaTypeId, req.body.Milliseconds]);

    console.log(result);
    result.changes > 0 ?  res.status(201).json(result) : res.status(404).json(result)
})

// Edit

router.get('/:id', (req, res)=>{
    const trackId = req.params.id;
    const statement = db.prepare("SELECT * FROM tracks WHERE TrackId = ?");
    const result = statement.get(trackId);

    console.log(result);    
    res.status(200).send(result)
})


router.patch('/:id', (req, res)=>{
    const trackId = req.params.id;
    const trackValidation = trackSchema.validate(req.body, {abortEarly: false});
    
    if(trackValidation.error){
        return res.status(422).send(trackValidation.error.details);
    }

    const statement = db.prepare("UPDATE tracks SET (Name, AlbumId, MediaTypeId, Milliseconds) = (?, ?, ?, ?) WHERE TrackId = ?");
    const result = statement.run([req.body.Name, req.body.AlbumId, req.body.MediaTypeId, req.body.Milliseconds, trackId]);

    console.log(result);
    result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})


// Delete track

router.delete('/:id', (req, res)=>{
    const trackId = req.params.id;

    const statement = db.prepare("DELETE FROM tracks WHERE TrackId = ?");
    const result = statement.run(trackId);

    result.changes > 0 ?  res.status(200).json(result) : res.status(404).json(result)
})

module.exports = router;