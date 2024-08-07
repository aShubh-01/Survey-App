const { prisma } = require('../config');
const { questionSchema } = require('../schemas/surveySchema');

const createQuestion = async (req, res) => {
    const { surveyId, questionLabel, type } = req.body;

    const parseResponse = questionSchema.safeParse(req.body);
    if(!parseResponse.success) {
        return res.status(500).json({
            message: "Invalid question schema",
            issues: parseResponse.error.issues
        })
    }

    try {
        const { id: questionId } = await prisma.question.create({
            data: {
                surveyId: parseInt(surveyId),
                questionLabel: questionLabel,
                type: type
            },
            select: {
                id: true
            }
        });

        return res.status(200).json({
            questionId,
            message: "Question Added!"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to add question"
        })
    }
}

const updateQuestion = async (req, res) => {
    const { questionLabel, type } = req.body;
    const questionId = parseInt(req.params.id);

    const parseResponse = questionSchema.safeParse(req.body);
    if(!parseResponse.success) {
        return res.status(500).json({
            message: "Invalid question schema",
            issues: parseResponse.error.issues
        })
    }

    try {
        await prisma.question.update({
            where: {
                id: questionId,
            },
            data: {
                questionLabel: questionLabel,
                type: type,
                options: {
                    updateMany: {
                        where: { questionId },
                        data: { isDeleted: true }
                    }
                }
            }
        });

        return res.status(200).json({
            questionId,
            message: "Question Updated!"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to update question"
        })
    }
}

const deleteQuestion = async (req, res) => {
    try {
        const questionId = parseInt(req.params.id);

        await prisma.$transaction(async (prisma) => {
            await prisma.question.update({
                where: { id: questionId },
                data: {
                    isDeleted: true
                }
            });

            await prisma.option.updateMany({
                where: { questionId: questionId },
                data: {
                    isDeleted: true
                }
            })
        })
        
        return res.status(200).json({
            message: "Deleted Question!"
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to delete question"
        })
    }
}

const toggleRequirement = async (req, res) => {
    try {
        const questionId = parseInt(req.params.id);

        const newRequirement = await prisma.$transaction(async (prisma) => {
            const { isRequired } = await prisma.question.findUnique({
                where: { id: questionId },
                select: { isRequired: true }
            })

            await prisma.question.update({
                where: { id: questionId },
                data: {
                    isRequired: !isRequired
                }
            })

            return !isRequired
        })

        return res.status(200).json({
            message: `Question requirement changed to ${newRequirement}`
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to set required"
        })
    }
}

module.exports = {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    toggleRequirement
}