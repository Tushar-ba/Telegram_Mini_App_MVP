const { User } = require('../models/miniApp');

const levelUp = async (req, res) => {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if(user.goldCoins < user.targetGold) return res.status(400).json({ message: 'You need to earn more gold to level up' });
    if(user.level >= 5) return res.status(400).json({ message: 'You have reached the maximum level' });
    const nextLevel = user.level + 1;
    user.level = nextLevel;
    user.targetGold = user.targetGold * 2;
    user.tapGold = user.tapGold + 5;
    user.energy = user.energy + 1000;
    await user.save();  
    res.status(200).json({ message: 'Level up successful', level: nextLevel, targetGold: user.targetGold, tapGold: user.tapGold, energy: user.energy });
}   

module.exports = { levelUp };