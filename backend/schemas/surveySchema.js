const z = require('zod');

const surveySchema = z.object({
    surveyTitle: z.string(),
    description: z.optional(z.string()),
})

const questionSchema = z.object({
    questionLabel: z.string(),
    type: z.literal('SINGLE_SELECT').or(z.literal('MULTIPLE_SELECT')).or(z.literal('TEXT'))
})

const optionSchema = z.object({
    optionLabel: z.string()
})

module.exports = {
    surveySchema,
    questionSchema,
    optionSchema
}