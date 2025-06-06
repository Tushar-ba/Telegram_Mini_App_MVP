const { User, Transaction } = require('../../models/miniApp');

const STAR_PACKAGES = [
    { id: "small", stars: 500, cost: 100 },
    { id: "medium", stars: 1200, cost: 200 },
    { id: "large", stars: 2500, cost: 400 }
  ];

const purchaseStars = async (req, res) => {
    const {userId, starsPackage} = req.body;
    try {
        const user = await User.findOne({ userId });
        if(!user) return res.status(404).json({ error: 'User not found' });
        
        // Handle both string and object formats for starsPackage
        const packageId = typeof starsPackage === 'string' ? starsPackage : starsPackage.id;
        const selectedPackage = STAR_PACKAGES.find(pkg => pkg.id === packageId);
        
        if (!selectedPackage) {
            return res.status(400).json({ error: 'Invalid package ID' });
          }

    user.stars += selectedPackage.stars;
    await user.save();

    await new Transaction({
        userId: user.userId,
        type: 'starPurchase',
        amount: selectedPackage.stars,
        details: { packageId: packageId, costINR: selectedPackage.cost },
        timestamp: Date.now()
      }).save();
      res.status(200).json({
        stars: user.stars,
        message: `Purchased ${selectedPackage.stars} stars for ₹${selectedPackage.cost}`
      });
    } catch (error) {
        console.error('Error in purchaseStars:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { purchaseStars };