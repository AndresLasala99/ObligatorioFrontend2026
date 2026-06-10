import Joi from "joi"

export const entrenamientoSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "El título es obligatorio.",
    "string.min": "El título debe tener al menos {#limit} caracteres.",
    "string.max": "El título no puede tener más de {#limit} caracteres.",
    "any.required": "El título es obligatorio.",
  }),
  descripcion: Joi.string().trim().max(200).required().messages({
    "string.empty": "La descripción es obligatoria.",
    "string.max": "La descripción no puede tener más de {#limit} caracteres.",
    "any.required": "La descripción es obligatoria.",
  }),
  nivel: Joi.string().valid("principiante", "intermedio", "avanzado").required().messages({
    "any.only": "El nivel debe ser principiante, intermedio o avanzado.",
    "any.required": "El nivel es obligatorio.",
  }),
  duracionMinutos: Joi.number().integer().positive().required().messages({
    "number.base": "La duración debe ser un número.",
    "number.integer": "La duración debe ser un número entero.",
    "number.positive": "La duración debe ser mayor a 0.",
    "any.required": "La duración es obligatoria.",
  }),
  cupoMaximo: Joi.number().integer().min(1).required().messages({
    "number.base": "El cupo debe ser un número.",
    "number.integer": "El cupo debe ser un número entero.",
    "number.min": "El cupo debe ser al menos 1.",
    "any.required": "El cupo es obligatorio.",
  }),
  fecha: Joi.string().required().messages({
    "string.empty": "La fecha es obligatoria.",
    "any.required": "La fecha es obligatoria.",
  }),
  categoria: Joi.string().required().messages({
    "string.empty": "La categoría es obligatoria.",
    "any.required": "La categoría es obligatoria.",
  }),
  imagen: Joi.any().optional(),
})
