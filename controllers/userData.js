const { User } = require('../models/miniApp');

exports.getUserData = async (req,res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({userId});
        if(!user) {
            return res.status(201).json({
                success: false,
                message: 'User not found'
            });
        }   
        const result =res.status(200).json({      
            success: true,
            user
        });

        console.log(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}