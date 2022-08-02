const express = require('express');
const router = express.Router();
const cars = require('../controllers/cars');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCar } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Car = require('../models/car');

router.route('/')
    .get(catchAsync(cars.index))
    .post(isLoggedIn, upload.array('image'), validateCar, catchAsync(cars.createCar))


router.get('/new', isLoggedIn, cars.renderNewForm)

router.route('/:id')
    .get(catchAsync(cars.showCar))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCar, catchAsync(cars.updateCar))
    .delete(isLoggedIn, isAuthor, catchAsync(cars.deleteCar));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(cars.renderEditForm))



module.exports = router;