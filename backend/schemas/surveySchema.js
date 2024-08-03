const z = require('zod');

const surveySchema = z.object({
    surveyTitle: z.string().min(1, { message: "Title cannot be empty"}),
    description: z.optional(z.string().min(1, { message: "Description cannot be empty"})),
})

const questionSchema = z.object({
    questionLabel: z.string().min(1, { message: "Label cannot be empty"}),
    type: z.literal('SINGLE_SELECT').or(z.literal('MULTIPLE_SELECT')).or(z.literal('TEXT'))
})

const optionSchema = z.object({
    optionLabel: z.string().min(1, { message: "Label cannot be empty"})
})

module.exports = {
    surveySchema,
    questionSchema,
    optionSchema
}