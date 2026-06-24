import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";

/* Valida las credenciales de inicio de sesion de un administrador */
const validateUser = async (correo, clave) => {
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) return null;

    const match = await bcrypt.compare(clave, user.clave);
    if (match) {
        return user.get({ plain: true }); //Convertir a objeto de js, sin data extra
    }
    return null;
};

export default {
    validateUser
};