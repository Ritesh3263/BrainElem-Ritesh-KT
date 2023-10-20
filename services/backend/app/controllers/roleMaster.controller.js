const db = require("../models");
const RoleMaster = db.roleMaster;
const Permissions = db.permissions;
const RolePermissionsMapping = db.rolePermissionsMapping;

// DB Calls
module.exports.findRoleMaster = async (query) => {
    const roleMaster = await RoleMaster.findOne(query);
    return roleMaster
};

module.exports.updateRoleMaster = async (query, update) => {
    const roleMaster = await RoleMaster.findOneAndUpdate(query, update, {
        new: true
    });
    return roleMaster;
};


// logic
/**
 * @openapi
 * /api/v1/rolemasters/:
 *   get:
 *     description: Get List of Role Masters
 *     tags:
 *       - _Role Master 
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: RoleMasters fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: "RoleManager"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */
module.exports.getAllRoleMasters = async (req, res) => {
    const roleMasters = await RoleMaster.find({status: {$ne: "deleted"}, $or: [{module: req.moduleId}, {module: "ALL"}]});
    return res.status(200).json({
        message: "RoleMasters fetched successfully",
        data: roleMasters
    });
};

/**
 * @openapi
 * /api/v1/rolemasters/list:
 *   get:
 *     description: Get List of Role Permissions Mapping
 *     tags:
 *       - _Cognitive User Module 
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Role Permissions Mapping fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  permissions:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        moduleName:
 *                          type: string
 *                          example: "Users"
 *                        access:
 *                          type: boolean
 *                          example: true
 *                        edit:
 *                          type: boolean
 *                          example: true
 *                  roleMaster:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Administrator"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */
module.exports.getAllRolePermissionsMappings = async (req, res) => {
    const roleMasters = await RoleMaster.find({status: {$ne: "deleted"}, $or: [{module: req.moduleId}, {module: "ALL"}]}, {_id: 1});
    const maps = await RolePermissionsMapping.find({roleMaster: {$in: roleMasters}}).populate(["roleMaster", "permissions"]);
    return res.status(200).json({
        message: "Role Permissions Mapping fetched successfully",
        data: maps
    });
}


/**
 * @openapi
 * /api/v1/rolemasters/{id}:
 *   get:
 *     description: Get Role Master By Id
 *     tags:
 *       - _Role Master
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: RoleMaster fetched successfully
 *            data:
 *              type: object
 *              properties:
 *                roleMaster:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: "RoleManager"
 *                permissions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      moduleName:
 *                        type: string
 *                        example: "Users"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: RoleMaster not found
 */
module.exports.findRoleMasterById = async (req, res) => {
    const roleMaster = await this.findRoleMaster({ _id: req.params.id, status: {$ne: "deleted"} });
    if (!roleMaster) return res.status(404).json({message: "RoleMaster not found"});
    const map = await RolePermissionsMapping.findOne({roleMaster: roleMaster._id}).populate(["roleMaster","permissions"]);
    return res.status(200).json({
        message: "RoleMaster fetched successfully",
        data: map
    });
}

/**
 * @openapi
 * /api/v1/rolemasters/:
 *   post:
 *     description: Create Role Master
 *     tags:
 *       - _Role Master 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the Role
 *                example: "RoleManager"
 *              description:
 *                type: string
 *                description: Description of the Role
 *                example: "One who manage Role System"
 *              module:
 *                type: string
 *                description: Module Id
 *                example: "333000000000000000000000"
 *              permissions:
 *                type: array
 *                description: Array of permissions id
 *                example: ["63c8f4f888bbc68cce0eb6dd"]
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Role Master Created successfully
 *            data:
 *              type: object
 *              properties:
 *                roleMaster:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: "RoleManager"
 *                permissions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                       type: string
 *                       example: "Users"
 *                  
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: name is required | RoleMaster with given name exists
 */
module.exports.createRoleMaster = async (req, res) => {
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({message: "name is required"});
    }
    if (!body.permissions || !Array.isArray(body.permissions) || !body.permissions.length) {
        return res.status(400).json({message: "permissions required"});
    }
    let roleMaster = await this.findRoleMaster({ name: body.name, module: req.moduleId });
    if (roleMaster) return res.status(400).json({message: "RoleMaster with given name exists"});

    const object = {
      name: body.name,
      description: body.description,
      module: req.moduleId,
    };
    roleMaster = await RoleMaster.create(object);
    // Map Role and permissions
    const map = await mapRolePermissions(roleMaster, body.permissions);
    return res.status(200).json({
        message: "Role Master Created Successfully",
        data: map
    });
};

const mapRolePermissions = async (roleMaster, permissions) => {
    // delete if any existing mapping
    const existMap = await RolePermissionsMapping.findOneAndDelete({roleMaster: roleMaster._id});
    const object = {
        roleMaster: roleMaster._id,
        permissions: permissions
    };
    let map = await RolePermissionsMapping.create(object);
    // activate role master
    await RoleMaster.findOneAndUpdate({_id: roleMaster._id}, {status: "active"});
    map = await RolePermissionsMapping.findOne({roleMaster: roleMaster._id}).populate(["roleMaster", "permissions"]);
    return map;
}

/**
 * @openapi
 * /api/v1/rolemasters/{id}:
 *   patch:
 *     description: Update Role Master By Id
 *     tags:
 *       - _Role Master
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             roleMaster:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the Role
 *                   example: "RoleManager"
 *                 description:
 *                   type: string
 *                   description: Description of the Role
 *                   example: "One who manage Role System"
 *                 module:
 *                   type: string
 *                   description: Module Id
 *                   example: "333000000000000000000000"
 *             permissions:
 *               type: array
 *               description: Array of permissions id
 *               example: ["63c8f4f888bbc68cce0eb6dd"]
 *         
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Role Master Updated successfully
 *            data:
 *              type: object
 *              properties:
 *                roleMaster:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      example: "RoleManager"
 *                permissions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                       type: string
 *                       example: "Users"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: RoleMaster not found
 */
module.exports.updateRoleMasterByQuery = async (req, res) => {
    const roleMasterId = req.params.id;
    const roleMaster = await this.findRoleMaster({ _id: roleMasterId, status: {$ne: "deleted"} });
    if (!roleMaster) return res.status(404).json({message: "RoleMaster not found"});
    if (roleMaster.protected) {
        return res.status(400).json({message: "Default Roles Can not be modified. Please contact Administration"});
    }
    const body = req.body;
    if (!body.permissions.length) {
        return res.status(400).json({message: "Permissions can not be empty!"});
    }

    const update = await this.updateRoleMaster({_id: roleMasterId}, body.roleMaster);
    const updateMap = await updateRolePermissionsMapping(update, body.permissions);
    return res.status(200).json({
        message: "Role Master Updated Successfully",
        data: updateMap
    });
};

const updateRolePermissionsMapping = async (roleMaster, permissions) => {
    let map = await RolePermissionsMapping.findOneAndUpdate({roleMaster: roleMaster._id}, {permissions: permissions}, {new: true}).populate(["roleMaster", "permissions"]);
    return map;
}

/**
 * @openapi
 * /api/v1/rolemasters/{id}:
 *   delete:
 *     description: Delete Role Master By Id
 *     tags:
 *       - _Role Master
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Role Master deleted successfully
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: RoleMaster not found
 */
module.exports.deleteRoleMaster = async (req, res) => {
    const roleMasterId = req.params.id;
    const roleMaster = await this.findRoleMaster({ _id: roleMasterId, status: {$ne: "deleted"} });
    if (!roleMaster) return res.status(404).json({message: "RoleMaster not found"});

    if (roleMaster.protected) {
        return res.status(400).json({message: "Default Roles Can not be deleted. Please contact Administration"});
    }
    

    const updateData = {
        name: generateTempName(roleMaster.name),
        status: "deleted"
    };
    const update = await this.updateRoleMaster({_id: roleMasterId}, updateData);
    // update rolepermissions mapping
    const updateMapping = await RolePermissionsMapping.deleteMany(
        { roleMaster: roleMasterId }
    );
    return res.status(200).json({
        message: "Role Master Deleted Successfully",
    });
}

const generateTempName = (name = "name") => {
    return `${name}_${Date.now()}`;
}