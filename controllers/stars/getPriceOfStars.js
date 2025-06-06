const { User } = require('../../models/miniApp');

const getPriceOfStars = async (req, res) => {
  const STAR_PACKAGES = [
    { id: "small", stars: 500, cost: 100 }, // INR
    { id: "medium", stars: 1200, cost: 200 },
    { id: "large", stars: 2500, cost: 400 }
  ];
  try {
    return res.status(200).json({
        message: STAR_PACKAGES
    })
  } catch (error) {
    console.error('Error in getPriceOfStars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getPriceOfStars };