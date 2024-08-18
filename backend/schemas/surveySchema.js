const z = require('zod');

const surveySchema = z.object({
    surveyTitle: z.optional(z.string()),
    description: z.optional(z.string()),
})

const questionSchema = z.object({
    questionLabel: z.optional(z.string()),
    type: z.optional(z.literal('SINGLE_SELECT').or(z.literal('MULTIPLE_SELECT')).or(z.literal('TEXT')))
})

const optionSchema = z.object({
    optionLabel: z.string()
})

module.exports = {
    surveySchema,
    questionSchema,
    optionSchema
}