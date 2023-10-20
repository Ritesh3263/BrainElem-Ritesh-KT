var axios = require('axios');

// Get all contracts from blockchain service
exports.getContracts = async (req, res) => {
    let response = await axios.get(`${process.env.ELIA_BLOCKCHAIN_URL}/contracts`)
    res.status(200).json(response.data);
};

// Add new network for selected contract
exports.addNetwork = async (req, res) => {
    let response = await axios.post(`${process.env.ELIA_BLOCKCHAIN_URL}/contracts/${req.params.contractName}/networks`, { ...req.body})
    res.status(200).json(response.data);
};

// Get file from blockchain service
exports.getScript = async (req, res) => {
    let response = await axios.get(`${process.env.ELIA_BLOCKCHAIN_URL}/${req.params.scriptName}`)
    res.status(200).json(response.data);
};