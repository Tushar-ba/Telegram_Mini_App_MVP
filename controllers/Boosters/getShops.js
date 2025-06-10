const BOOSTERS_DETAILS = require('./boosters');

const getShops = async (req, res) => {
    const shops = BOOSTERS_DETAILS.filter(booster => booster.type === 'shop');
    res.status(200).json({ shops });
}

module.exports = { getShops };