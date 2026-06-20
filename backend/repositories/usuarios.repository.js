import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";

/**
 * Valida las credenciales de inicio de sesión de un administrador.
 * @param {string} correo - El correo electrónico ingresado por el usuario.
 * @param {string} clave - La contraseña ingresada por el usuario.
 * @returns {Promise<Object|null>} El objeto del usuario si la validación es exitosa, o null en caso de error.
 */
const validateUser = async (correo, clave) => {
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) return null;

    const match = await bcrypt.compare(clave, user.clave);
    if (match) {
        return user.get({ plain: true });
    }
    return null;
};

export default {
    validateUser
};