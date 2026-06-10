import Joi from "joi"

export const categoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(30).required().messages({
    "string.empty": "El nombre es obligatorio.",
    "string.min": "El nombre debe tener al menos {#limit} caracteres.",
    "string.max": "El nombre no puede tener más de {#limit} caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  descripcion: Joi.string().trim().max(100).allow("").optional().messages({
    "string.max": "La descripción no puede tener más de {#limit} caracteres.",
  }),
  imagen: Joi.any().optional(),
})
