const { logger } = require("../logs/logger");
const { configurations } = require("../config/config");
const sequelize = require("../db/connect");
const user = require("../models/user/user");
const { findEmailFromUser } = require("../utilities/logInFunctions");
const { comparePassword } = require("../utilities/password")
const bcrypt = require('bcrypt')
const profileService = async (userName) => {
    console.log("----------", userName);

    if (!userName) {
        return {
            status: 0,
            data: configurations.Messages.profile.noUsername
        };
    }

    try {
        const findUser = await user.findOne({
            where: { userName: userName }
        });


        if (!findUser) {
            return {
                status: 0,
                data: configurations.Messages.profile.userNotFound
            };
        }

        return {
            status: 1,
            data: findUser
        };

    } catch (error) {
        logger.error("Error from profileService: ", error);
        return {
            status: 500,
            data: configurations.Messages.profile.Error
        };
    }
};

const updatePasswordService = async (oldPassword,
    newPassword, userName) => {

    console.log("hiiiiiiiiiiiiii");

    if (!userName || !oldPassword || !newPassword) {
        return {
            status: 0,
            data: configurations.Messages.updatePassword.provideDetails
        }
    }
    try {
        const validUser = await user.findOne({
            where: {
                userName: userName
            }
        })

        if (validUser) {
            const isMatch = await comparePassword(oldPassword, validUser.password)

            if (isMatch) {
                const updateToNewPassword = await bcrypt.hash(newPassword, 10)


                await user.update({ password: updateToNewPassword }, { where: { userName: userName } })
                return {
                    status: 1,
                    data: configurations.Messages.updatePassword.passwordChangeSuccessful
                }
            }
            else {
                return {
                    status: 0,
                    data: configurations.Messages.updatePassword.passwordNotMatched
                }
            }
        }
        else {
            return {
                status: 0,
                data: configurations.Messages.updatePassword.userNotFound
            }
        }

    } catch (error) {
        console.log("Error in updatePassword: ", error)
        return {
            status: 0,
            data: configurations.Messages.updatePassword.Error
        }
    }
}

module.exports = {
    profileService,
    updatePasswordService
};
