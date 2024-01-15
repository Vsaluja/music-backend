const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const multer = require('multer');
const dbPath = path.join(process.cwd(), './database/chinook.sqlite');
const db = Database(dbPath);
const Joi = require('joi');


router.get('/api/artists', (req, res)=>{
    
    const statement = db.prepare('SELECT * FROM artists');
    
    // Handle the results
    const data = statement.all();

    res.status(200).json(data);
})


router.get('/api/artists/:artistId/albums', (req, res)=>{
    
    let id = req.params.artistId;
    id = Number(id);
    const statement = db.prepare('SELECT * FROM artists WHERE ArtistId = ?');

    const data = statement.get(id);
    let artistId = data.ArtistId;


    const statement2 = db.prepare('SELECT * FROM albums WHERE ArtistId = ?');
    const albumsData = statement2.all(artistId);
    
    res.status(200).json(albumsData);
})


router.get('/api/albums/:albumId/tracks', (req, res)=>{

    let albumId = req.params.albumId;
    const statement = db.prepare('SELECT * FROM tracks WHERE albumId = ?');
    const trackData = statement.all(albumId);

    res.status(200).json(trackData);
})

const storageLoc = multer.diskStorage({
    destination: './_FrontendStarterFiles/albumart',
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storageLoc});

router.post('/api/albums/:albumId/albumart', upload.single('albumart'), (req, res)=>{
    const albumId = req.params.albumId;

    const fileData = req.file.filename;

    const inserStatement = db.prepare('UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?');
    const result = inserStatement.run([fileData, albumId]);

    console.log(result);
})


// Themes
router.get('/api/themes', (req, res)=>{
    const statement = db.prepare("SELECT * FROM themes");
    const result = statement.all();

    res.status(200).send(result);
})

// Media types
router.get('/api/mediatypes', (req, res)=>{
    const statement = db.prepare("SELECT * FROM media_types");
    const result = statement.all();

    res.status(200).send(result);
})



module.exports = router