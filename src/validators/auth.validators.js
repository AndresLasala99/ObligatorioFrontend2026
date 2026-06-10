import Joi from "joi"

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "El email es obligatorio.",
    "string.email": "El email debe tener un formato valido.",
    "any.required": "El email es obligatorio.",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "any.required": "La contraseña es obligatoria.",
  }),
})

export const registerSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre no puede tener más de {#limit} caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "El email es obligatorio.",
    "string.email": "El email debe tener un formato valido.",
    "any.required": "El email es obligatorio.",
  }),
  password: Joi.string().trim().min(6).pattern(/^(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "string.pattern.base": "La contraseña debe tener al menos una mayúscula y un número.",
    "any.required": "La contraseña es obligatoria.",
  }),
  confirmPassword: Joi.string().trim().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas no coinciden.",
    "any.required": "Debes repetir la contraseña.",
  }),
  rol: Joi.string().valid("cliente", "entrenador").required().messages({
    "any.only": "El rol debe ser cliente o entrenador.",
    "any.required": "El rol es obligatorio.",
  }),
})
