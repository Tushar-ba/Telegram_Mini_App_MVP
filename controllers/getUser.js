const { User } = require('../models/miniApp');

const getUserWithoutAuth = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(204).json({
                success: false,
                message: 'User not found'
            });
        }else{
            return res.status(200).json({
                success: true,
                message: 'User found',
                userId: user.userId,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = { getUserWithoutAuth };