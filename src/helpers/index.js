// const {TOKEN_KEY} = require("../constant");
const {hashSync, compareSync} = require("bcrypt");

// const {LOGIN_TOKEN} = require("../constant");
// const {UserToken, Permission, User, UserAppToken} = require("../models")
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken')

function encryptPassword(string) {
    return hashSync(string, 4)
}

const customEducationIdProvider = async (name, modelName) => {
    const alreadyExists = await modelName.findOne({where: {name: name}})
    if (alreadyExists) {
        return alreadyExists.id;
    } else {
        const data = await modelName.create({
            name: name,
        });
        return data.id;
    }
}

const addTags = async (ids, leadId, modelName1, modelName2) => {
    for (const id of ids) {
        if (isNaN(Number(id))) {
            const data = await modelName1.create({
                name: id,
            })
            await modelName2.create({
                leadId: leadId,
                tagId: data?.id
            })
        } else {
            await modelName2.create({
                leadId: leadId,
                tagId: id
            })
        }
    }
}


function matchPassword(encrpted, password) {
    return compareSync(password, encrpted);
}

const pagination = (data, page, limit) => {
    if (limit && !page) {
        return data.slice(0, limit)
    } else if (!limit && page) {
        const offset = 10 * (page - 1)
        return data.slice(offset, offset + 10);
    } else if (limit && page) {
        const offset = limit * (page - 1)
        return data.slice(offset, offset + Number(limit))
    } else {
        return data;
    }
}

const generateOtp = (length = 6) => {
    const number = Math.pow(10, length - 1);
    return Math.floor(number + Math.random() * 9 * number)
}

// Create token
const generateToken = (user) => {
    return jwt.sign(
        {user_id: user.id, name: user.name, email: user.email, mobile: user.mobile},
        process.env.APP_TOKEN_KEY,
    );
}
const uploadImage = async (image, filepath) => {
    // const {userId} = await getCandidateLoginTokenFromRequest(req);
    const fileName = image.md5 + +new Date + 1;
    const extension = path.extname(image.name);
    await image.mv(`assets/${filepath}/` + fileName + extension);
    return fileName + extension;
}

const unlinkImage = async (filename, filepath) => {
    await fs.unlink(path.resolve(`assets/${filepath}/${filename}`), (err) => {
        if (err) console.error('Error deleting file:', err);
    });
}

const convertStringToVal = (val) => {
    switch (val) {
        case "true":
            return true;
        case "false":
            return false;
        case "null":
            return null;
        case "undefined":
            return undefined;
        case "{}":
            return {};
        default:
            return val;
    }
};

const verifyOtp = (storeOtp, otp) => {
    return storeOtp === otp;
}

const uploadPdf = async (image, filepath) => {
    // const {userId} = await getCandidateLoginTokenFromRequest(req);
    const fileName = image.md5 + +new Date + 1;
    const extension = path.extname(image.name);
    await image.mv(`assets/${filepath}/` + fileName + extension);
    return fileName + extension;
}

const uploadCsv = async (csv, filepath) => {
    // const {userId} = await getCandidateLoginTokenFromRequest(req);
    const fileName = csv.md5 + +new Date + 1;
    const extension = path.extname(csv.name);
    await csv.mv(`assets/${filepath}/` + fileName + extension);
    return fileName + extension;
}
const uploadApk = async (csv, filepath) => {
    // const {userId} = await getCandidateLoginTokenFromRequest(req);
    const fileName = csv.md5 + +new Date + 1;
    const extension = path.extname(csv.name);
    await csv.mv(`assets/${filepath}/` + fileName + extension);
    return fileName + extension;
}

// const PLoginTokenFromRequest = async (req, res) => {
//     let {login_token} = req;
//     if (!login_token) {
//         let token_id = req.headers.authorization || req.query.token_id || "";
//         token_id = token_id.replace("Bearer ", "");
//         login_token = await PassengerToken.findOne({
//             where: {
//                 token: token_id,
//                 type: LOGIN_TOKEN
//             }
//         });
//     }
//     return login_token
// }

const ULoginTokenFromRequest = async (req, res) => {
    let {login_token} = req;
    if (!login_token) {
        let token_id = req.headers.authorization || req.query.token_id || "";
        token_id = token_id.replace("Bearer ", "");
        login_token = await UserToken.findOne({
            where: {
                token: token_id,
                // type: LOGIN_TOKEN
            }
        });
    }
    return login_token
}

// const AppLoginTokenFromRequest = async (req, res) => {
//     let {login_token} = req;
//     if (!login_token) {
//         let token_id = req.headers.authorization || req.query.token_id || "";
//         token_id = token_id.replace("Bearer ", "");
//         login_token = await UserAppToken.findOne({
//             where: {
//                 token: token_id,
//                 type: LOGIN_TOKEN
//             }
//         });
//     }
//     return login_token
// }

// const DLoginTokenFromRequest = async (req) => {
//     let {login_token} = req;
//     if (!login_token) {
//         let token_id = req.headers.authorization || req.query.token_id || "";
//         token_id = token_id.replace("Bearer ", "");
//         login_token = await DriverToken.findOne({
//             where: {
//                 token: token_id,
//                 type: LOGIN_TOKEN
//             }
//         })
//     }
//     return login_token
// }

const hasPermissionOrFail = async (userId, value) => {
    const user = await User.findOne({
        where: {id: userId},
        include: [
            {
                model: Permission,
                as: "permission"
            }
        ]
    });
    const check = await user?.permission?.find(({code}) => code === value);
    if (!check)
        throw new Error("You don't have necessary permissions");
    else
        return true;
};

// const createActivityLog = async (log) => {
//     await ActivityLog.create(log);
// }

module.exports = {
    encryptPassword,
    matchPassword,
    generateOtp,
    generateToken,
    hasPermissionOrFail,
    // DLoginTokenFromRequest,
    // PLoginTokenFromRequest,
    // ULoginTokenFromRequest,
    // createActivityLog,
    verifyOtp,
    pagination,
    uploadImage,
    unlinkImage,
    convertStringToVal,
    uploadPdf,
    uploadCsv,
    uploadApk,
    customEducationIdProvider,
    addTags,
    // AppLoginTokenFromRequest
}
