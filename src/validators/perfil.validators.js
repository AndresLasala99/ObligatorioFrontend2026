import Joi from "joi"

export const fotoPerfilSchema = Joi.object({
  imagen: Joi.any().required().messages({
    "any.required": "La imagen es obligatoria.",
  }),
})

export const cambiarPasswordSchema = Joi.object({
  passwordActual: Joi.string().trim().required().messages({
    "string.empty": "La contraseña actual es obligatoria.",
    "any.required": "La contraseña actual es obligatoria.",
  }),
  passwordNueva: Joi.string().trim().min(6).pattern(/^(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "La nueva contraseña es obligatoria.",
    "string.min": "La nueva contraseña debe tener al menos {#limit} caracteres.",
    "string.pattern.base": "La nueva contraseña debe tener al menos una mayúscula y un número.",
    "any.required": "La nueva contraseña es obligatoria.",
  }),
  confirmarPasswordNueva: Joi.string().trim().valid(Joi.ref("passwordNueva")).required().messages({
    "any.only": "Las contraseñas nuevas no coinciden.",
    "any.required": "Debes repetir la nueva contraseña.",
  }),
})
