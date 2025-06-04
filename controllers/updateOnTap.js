const { User } = require('../models/miniApp');

exports.updateOnTap = async (req,res) => {
    const {userId} = req.params;
    try {
        const user = await User.findOne({userId});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const updatebalance = user.goldCoins + user.tapAmount;
        user.goldCoins = updatebalance;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Balance updated successfully',
            balance: updatebalance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        }); 
    }
}