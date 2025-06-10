const { User } = require('../../models/miniApp');

const getCurrentMembership = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({userId});
        if(!user) return res.status(204).json({
            success: false,
            message: 'User not found'
        });
        const currentMembership = user.membership;
        return res.status(200).json({
            success: true,
            message: 'Current membership fetched successfully',
            data: {
                membership: currentMembership
            }
        })
    } catch (error) {
        console.error('Error in getCurrentMembership:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = { getCurrentMembership };
