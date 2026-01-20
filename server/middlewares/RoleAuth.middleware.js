export const RoleAuthorization = (...AuthRoles) => {
    return (req, res, next) => {
        if (!AuthRoles.includes(req.Role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Bạn không có quyền truy cập vào chức năng này" 
            });
        }
        next();
    } 
}