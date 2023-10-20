const User = require("../models")

exports.removeScopes = (id) => {

    db.user.updateMany( // Remove all scopes contained in Users
        {"scopes.name": {$regex: id+'$'}},
        {$pull: {"scopes": {"name": {$regex: id+'$'}}}},
        {"multi": true},
        function (err, result){ 
            if (err) console.error(err) 
            else console.log("Removed related scopes inside", result.nModified, "users")
        }
    )

    db.user.updateMany( // Remove all scopes contained in Groups
        {"scopes.name": {$regex: id+'$'}},
        {$pull: {"scopes": {"name": {$regex: id+'$'}}}},
        {"multdi": true},
        function (err, result){ 
            if (err) console.error(err) 
            else console.log("Removed related scopes inside", result.nModified, "groups")
        }
    )
}