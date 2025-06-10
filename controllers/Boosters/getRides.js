const BOOSTERS_DETAILS = require('./boosters');

const getRides = async (req, res) => {
    const rides = BOOSTERS_DETAILS.filter(booster => booster.type === 'ride');
    res.status(200).json({ rides });
}

module.exports = { getRides };