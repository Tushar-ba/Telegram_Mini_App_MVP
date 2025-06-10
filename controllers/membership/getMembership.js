const MEMBERSHIP_DETAILS = require('./membershipChart');

const getMembership = async (req, res) => {
    try {
        const membership = MEMBERSHIP_DETAILS;
        return res.status(200).json({
            success: true,
            message: 'Membership details fetched successfully',
            membership
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = { getMembership };