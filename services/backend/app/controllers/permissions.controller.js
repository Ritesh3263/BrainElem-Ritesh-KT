const db = require("../models");
const Permissions = db.permissions;
const permissionsModuleList = require("./../utils/permissionsModuleList");

// DB Calls
module.exports.findPermissions = async (query) => {
    const permissions = await Permissions.findOne(query);
    return permissions;
};

module.exports.updatePermissions = async (query, update) => {
    const permissions = await Permissions.findOneAndUpdate(query, update, {
        new: true
    });
    return permissions;
};


// logic
/**
 * @openapi
 * /api/v1/permissions/:
 *   get:
 *     description: Get List of Permissions
 *     tags:
 *       - _Permissions 
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Permissions fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: "RolePermissions"
 *                  moduleName:
 *                    type: string
 *                    example: "Users"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */
module.exports.getAllPermissions = async (req, res) => {
    const permissions = await Permissions.find({status: {$ne: "deleted"}, $or: [{module: req.moduleId}, {module: "ALL"}]});
    return res.status(200).json({
        message: "Permissions fetched successfully",
        data: permissions
    });
}

/**
 * @openapi
 * /api/v1/permissions/{id}:
 *   get:
 *     description: Get Permissions By Id
 *     tags:
 *       - _Permissions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0f9172534a0c88d6047a
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Permissions fetched successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "RolePermissions"
 *                moduleName:
 *                    type: string
 *                    example: "Users"
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
 *               example: Permissions not found
 */
module.exports.findPermissionsById = async (req, res) => {
    const permissions = await this.findPermissions({ _id: req.params.id, status: {$ne: "deleted"} });
    if (!permissions) return res.status(404).json({message: "Permissions not found"});
    return res.status(200).json({
        message: "Permissions fetched successfully",
        data: permissions
    });
}

/**
 * @openapi
 * /api/v1/permissions/:
 *   post:
 *     description: Create Permissions
 *     tags:
 *       - _Permissions
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
 *                description: Name of the Permissions
 *                example: "RolePermissions"
 *              moduleName:
 *                type: string
 *                description: Module Name
 *                example: "Users"
 *              module:
 *                type: string
 *                description: Module Id
 *                example: "333000000000000000000000"
 *              access:
 *                type: boolean
 *                description: access permission true or false
 *                example: true
 *              edit:
 *                type: boolean
 *                description: edit permission true or false
 *                example: true
 *              description:
 *                type: string
 *                description: Description of the Permissions
 *                example: "Users Permissions"
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Permissions Created successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Rolepermissions"
 *                moduleName:
 *                    type: string
 *                    example: "Users"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: name is required | Permissions with given name exists
 *  
 */
module.exports.createPermissions = async (req, res) => {
    const body = req.body;
    if (!body.moduleName) {
      return res.status(400).json({message: "moduleName is required"});
    }
    if (!permissionsModuleList.includes(body.moduleName)) {
        return res.status(400).json({message: "Invalid moduleName"});
    }
    const permissions = await this.findPermissions({ name: body.name, status: {$ne: "deleted"}, module: req.moduleId });
    if (permissions) return res.status(400).json({message: "Permissions with given name exists"});

    const object = {
      name: body.name,
      module: req.moduleId,
      moduleName: body.moduleName,
      access: body.access,
      edit: body.edit,
      description: body.description
    };
    const record = await Permissions.create(object);
    return res.status(200).json({
        message: "Permissions Created Successfully",
        data: record
    });
};

/**
 * @openapi
 * /api/v1/permissions/{id}:
 *   patch:
 *     description: Update Permissions By Id
 *     tags:
 *       - _Permissions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0f9172534a0c88d6047a
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the Permissions
 *                example: "RolePermissions"
 *              moduleName:
 *                type: string
 *                description: Module Name
 *                example: "Users"
 *              module:
 *                type: string
 *                description: Module Id
 *                example: "333000000000000000000000"
 *              access:
 *                type: boolean
 *                description: access permission true or false
 *                example: true
 *              edit:
 *                type: boolean
 *                description: edit permission true or false
 *                example: true
 *              description:
 *                type: string
 *                description: Description of the Permissions
 *                example: "Users Permissions"
 *         
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Permissions Updated Successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "RolePermissions"
 *                moduleName:
 *                    type: string
 *                    example: "Users"
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
 *               example: Permissions not found
 */
module.exports.updatePermissionsByQuery = async (req, res) => {
    const permissionsId = req.params.id;
    const body = req.body;
    const permissions = await this.findPermissions({ _id: permissionsId, status: {$ne: "deleted"} });
    if (!permissions) return res.status(404).json({message: "Permissions not found"});

    if (permissions.protected) {
        return res.status(400).json({message: "Default Permissions Can not be modified. Please contact Administration"});
    }
    const update = await this.updatePermissions({_id: permissionsId}, body);
    return res.status(200).json({
        message: "Permissions Updated Successfully",
        data: update
    });
};

/**
 * @openapi
 * /api/v1/permissions/{id}:
 *   delete:
 *     description: Delete Permissions By Id
 *     tags:
 *       - _Permissions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0f9172534a0c88d6047a
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Permissions Deleted successfully
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
 *               example: Permissions not found
 */
module.exports.deletePermissions = async (req, res) => {
    const permissionsId = req.params.id;
    const permissions = await this.findPermissions({ _id: permissionsId, status: {$ne: "deleted"} });
    if (!permissions) return res.status(404).json({message: "Permissions not found"});
    if (permissions.protected) {
        return res.status(400).json({message: "Default Permissions Can not be deleted. Please contact Administration"});
    }
    const updateData = {
        name: generateTempName(permissions.name),
        status: "deleted"
    };
    const update = await this.updatePermissions({_id: permissionsId}, updateData);
    // Pull permissions from rolePermissions mapping
    const updateMapping = await db.rolePermissionsMapping.updateMany(
        { permissions: permissionsId },
        { $pull:  { permissions: permissionsId }}
    );
    return res.status(200).json({
        message: "Permissions Deleted Successfully",
    });
}

const generateTempName = (name = "name") => {
    return `${name}_${Date.now()}`;
}
