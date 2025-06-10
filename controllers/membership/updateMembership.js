const { User } = require('../../models/miniApp');
const MEMBERSHIP_DETAILS = require('./membershipChart');

const updateMembership = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find user
        const user = await User.findOne({userId});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const currentMembership = user.membership;
        
        // Check if current membership is gold, then upgrade to platinum
        if(currentMembership === 'gold'){
            const platinumDetails = MEMBERSHIP_DETAILS.find(m => m.type === 'platinum');
            
            if (!platinumDetails) {
                return res.status(500).json({
                    success: false,
                    message: 'Platinum membership configuration not found'
                });
            }
            
            user.membership = 'platinum';
            user.miningRate = platinumDetails.miningRate;
            
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: 'Membership upgraded from gold to platinum',
                data: {
                    membership: user.membership,
                    miningRate: user.miningRate
                }
            });
        } else if(currentMembership === 'platinum') {
            return res.status(200).json({
                success: true,
                message: 'You are already a platinum member'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Only gold members can upgrade to platinum'
            });
        }
        
    } catch (error) {
        console.error('Error in updateMembership:', error); 
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { updateMembership };