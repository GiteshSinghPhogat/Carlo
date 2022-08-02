const Car = require('../models/car');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const car = await Car.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    car.reviews.push(review);
    await review.save();
    await car.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/cars/${car._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Car.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/cars/${id}`);
}
