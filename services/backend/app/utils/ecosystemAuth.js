const db = require('../models')

exports.isNetworkInEcosystem = async (networkId, ecosystemId) => {
    return await db.ecosystem.exists({_id: ecosystemId, 'subscriptions._id': networkId})
}

exports.isModuleInNetwork = async (moduleId, networkId) => {
    let ecosystem = await db.ecosystem.findOne({'subscriptions.modules._id': moduleId, 'subscriptions._id': networkId}).exec()
    if (ecosystem) {
        let network = await ecosystem.subscriptions.id(networkId)
        return !!network.modules.id(moduleId)
    } else return false
}
