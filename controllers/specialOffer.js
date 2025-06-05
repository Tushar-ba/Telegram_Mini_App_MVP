const { User } = require('../models/miniApp');

const specialOffer = async (req, res) => {
  const { userId } = req.params;
  const SPECIAL_OFFER = {
    goldCoins: 500_000_000,
    stars: 1000
  };

  try {
    const user = await User.findOne({ userId });
    if(!user) return res.status(404).json({ error: 'User not found' });
    if(user.specialOfferClaimed) return res.status(400).json({ error: 'Special offer already claimed' });
    
    return res.status(200).json({
        message:SPECIAL_OFFER
    })

  } catch (error) {
    console.error('Error in specialOffer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { specialOffer };