const { User } = require('../models/miniApp');

const purchaseSpecialOffer = async (req, res) => {
  const { userId } = req.params;

try {
const user = await User.findOne({ userId });
  if(!user) return res.status(404).json({ error: 'User not found' });
  if(user.specialOfferClaimed) return res.status(400).json({ error: 'Special offer already claimed' });
  if(user.stars < 1000) return res.status(400).json({ error: 'Insufficient stars' });
  user.goldCoins += 500_000_000;
  user.stars -= 1000;
  user.specialOfferClaimed = true;
  await user.save();
  return res.status(200).json({
    message: 'Special offer purchased successfully',
    data:{
        goldCoins: user.goldCoins,
        stars: user.stars,
        specialOfferClaimed: user.specialOfferClaimed
    }
  })
    
} catch (error) {
    console.error('Error in purchaseSpecialOffer:', error);
    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
}

module.exports = { purchaseSpecialOffer };