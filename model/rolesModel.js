const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RolesSchema = new Schema({
    RoleID: {
        type: Number,
    },
    RoleName: {
        type: String
    },
    userLogRights: [{
        userlog: {
            userlogs: {
                type: Boolean
            }
        }
    }],
    UserRolesRights: [{
        users: {
            user: {
                type: Boolean
            },
            userRights: {
                userAdd: {
                    type: Boolean
                },
                userEdit: {
                    type: Boolean
                },
                userDelete: {
                    type: Boolean
                },
            },
            roleRights: {
                roleAdd: {
                    type: Boolean
                },
                roleEdit: {
                    type: Boolean
                },
                roleDelete: {
                    type: Boolean
                },
            }
        }
    }],
    RowStatus: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
module.exports = mongoose.model('roles', RolesSchema);