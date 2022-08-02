const Car = require('../models/car');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const cars = await Car.find({});
    res.render('cars/index', { cars })
}

module.exports.renderNewForm = (req, res) => {
    res.render('cars/new');
}

module.exports.createCar = async (req, res, next) => {
    const car = new Car(req.body.car);
    car.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.author = req.user._id;
    await car.save();
    console.log(car);
    req.flash('success', 'Successfully made a new car!');
    res.redirect(`/cars/${car._id}`)
}

module.exports.showCar = async (req, res,) => {
    const car = await Car.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!car) {
        req.flash('error', 'Cannot find that car!');
        return res.redirect('/cars');
    }
    res.render('cars/show', { car });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const car = await Car.findById(id)
    if (!car) {
        req.flash('error', 'Cannot find that car!');
        return res.redirect('/cars');
    }
    res.render('cars/edit', { car });
}

module.exports.updateCar = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const car = await Car.findByIdAndUpdate(id, { ...req.body.car });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.images.push(...imgs);
    await car.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await car.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated car!');
    res.redirect(`/cars/${car._id}`)
}

module.exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    await Car.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted car')
    res.redirect('/cars');
}