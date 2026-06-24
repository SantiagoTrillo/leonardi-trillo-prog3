import jwt from "jsonwebtoken";

// Middlewares de autentificacion
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/admin/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/admin/login");
    }
};

export default authMiddleware;