const Movies = require("../../db/models/movies");
const uuid4 = require("uuid4");
const express = require('express');
const Router = express.Router();
const {CookieValidation} = require("../../middlewares/authentication");

//Create new movie
Router.post('/', CookieValidation, async function(req, res) {
    try {
        const newMovie = new Movies({
            movieId: uuid4(),
            movieName: req.body.movieName,
            genre: req.body.genre,
            price: req.body.price,
            rating: req.body.rating,
            price: req.body.price,
            Reviews: req.body.Reviews,
        })
        await newMovie.save()
        console.log(`[SUCCESS] New movie added successfully, movie ID: ${newMovie.movieID}`)
        res.json("new movie added successfully")
    } catch (err) {
        console.log(`[FAIL] Failed to add new movie. ${err}`)
        res.status(400).json("Received incorrect new movie format")
    }
})

// Update movie information
Router.put('/', CookieValidation, async function(req, res) {
    try {
        const movieId = req.body.movieId
        let movie = await Movies.findOne({ movieID: movieID }).exec()
        movie.movieName = req.body.movieName && req.body.movieName || movie.movieName
        movie.rating = req.body.rating && req.body.rating || movie.rating
        movie.price = req.body.price && req.body.price || hotel.price
        movie.Reviews = req.body.Reviews && req.body.Reviews || hotel.Reviews
        await movie.save()
        console.log(`[SUCCESS] Changed movie ID ${movieId} information`)
        res.send()
    } catch (err) {
        console.log(`[FAIL] Failed to change hotel information, ${err}`)
        res.sendStatus(400)
    }
})

// Get all movies in database
Router.get('/', CookieValidation, async function(req, res) {
    try {
        const movies = await Movies.find().select('-_id -updatedAt').exec()
        res.json(movies)
        console.log(`[SUCCESS] Fetched ${Object.keys(hotels).length} movies`)
    } catch (err) {
        console.log(`Error fetching current movies in DB, ${err}`)
        res.json('Error fetching current movies in DB').status(500)
    }
})

module.exports = Router;