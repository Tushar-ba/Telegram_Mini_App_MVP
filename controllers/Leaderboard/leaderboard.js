    const { User } = require('../../models/miniApp');

    const leaderboard = async (req, res) => {
        try {
            const users = await User.find({}).sort({ miningRate: -1 }).limit(10).select('userId miningRate avatar');
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error in leaderboard:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    module.exports = { leaderboard };