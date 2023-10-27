
const checkRol = (roles) => (req, res, next) => {
    try {
        const {user} = req
        const userRoles = user.role

        const checkValueRol = roles.some(rolSingle => userRoles.includes(rolSingle))

        if (! checkValueRol) {
            res.status(403).json({error: "USER_NOT_PERMISSIONS"});
            return
        }

        next();
    } catch (err) {
        res.status(403).json({error: "ERROR_PERMISSIONS"});
    }
};

module.exports = checkRol;
