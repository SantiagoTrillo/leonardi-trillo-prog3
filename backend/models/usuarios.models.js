import bcrypt from "bcryptjs";
import Usuario from "./usuario.model.js";

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