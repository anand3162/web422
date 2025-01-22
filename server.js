
/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Anand Krishna Anil Kumar Student ID: 152227229 Date: 21st January 2025
* Vercel Link: https://web422-anands-projects-1ac7f41e.vercel.app/
*
********************************************************************************/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require('./modules/moviesDB');
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`);
            console.log(`Connected to MongoDB`);
        });
    })
    .catch(err => {
        console.error('Database initialization failed', err);
    });


app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
        .then(movie => res.status(201).json(movie))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/movies', (req, res) => {
    const { page = 1, perPage = 10, title } = req.query;
    db.getAllMovies(page, perPage, title)
        .then(movies => res.json(movies))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Movie not found' });
            res.json(movie);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.params.id, req.body)
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Movie not found' });
            res.json(movie);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(movie => {
            if (!movie) return res.status(404).json({ message: 'Movie not found' });
            res.status(204).send();
        })
        .catch(err => res.status(500).json({ error: err.message }));
});
module.exports = app;