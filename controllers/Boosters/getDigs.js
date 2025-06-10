const BOOSTERS_DETAILS = require('./boosters');

const getDigs = async (req, res) => {
    const digs = BOOSTERS_DETAILS.filter(booster => booster.type === 'dig');
    res.status(200).json({ digs });
}

module.exports = { getDigs };