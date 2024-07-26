const express = require('express');
const jwt = require('jsonwebtoken');
const { checkUser } = require('./middlewares/userAuth');
const { prisma, jwtSecret } = require('../config');

const surveyRouter = express.Router();

// MULTIPLE_CHOICE
// SINGLE_CHOICE
// TEXT

surveyRouter.use(checkUser);

surveyRouter.get('/all', async (req, res) => {
    try {
        const userId = req.userId;
        const allSurveys = await prisma.survey.findMany({
            where: {
                userId: userId,
                isDeleted: false,
            },
            select: {
                id: true,
                isPublished: true,
                surveyTitle: true,
                description: true,
                questions: {
                    where: {
                        isDeleted: false,
                    },
                    select: {
                        id: true,
                        questionLabel: true,
                        type: true,
                        isRequired: true,
                        options: {
                            where: {
                                isDeleted: false,
                            },
                            select: {
                                id: true,
                                optionLabel: true,
                            }
                        }
                    }
                }
            }
        });

        allSurveys.sort((a, b) => a.id - b.id);
        allSurveys.map((survey) => {
            survey.questions.sort((a, b) => a.id - b.id);
            survey.questions.map((question) => {
                question.options.sort((a, b) => a.id - b.id)
            })
        })


        return res.status(200).json({
            allSurveys
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to get all surveys"
        })
    }
})

surveyRouter.put('/publish/:id', async (req, res) => {
    try {
        const surveyId = parseInt(req.params.id);
        await prisma.survey.update({
            where: { id: surveyId },
            data: {
                isPublished: true
            }
        })

        return res.status(200).json({
            message: "Survey Published!"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to publish survey"
        })
    }
})

surveyRouter.get('/:id', async(req, res) => {

    const surveyId = parseInt(req.params.id);
    const userId = req.userId;

    const survey = await prisma.survey.findUnique({
        where: {
            userId: userId,
            id: surveyId,
            isDeleted: false,
            isPublished: true
        },
        select: {
            id: true,
            surveyTitle: true,
            description: true,
            isClosed: true,
            questions: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    questionLabel: true,
                    type: true,
                    isRequired: true,
                    attempts: true,
                    options: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            id: true,
                            optionLabel: true,
                            votes: true
                        }
                    }
                }
            }
        }
    });

    survey.questions.map((question) => {
        question.options.sort((a, b) => a.id)
    })

    return res.status(200).json({
        survey
    });
});

surveyRouter.post('/', async (req, res) => {
    try {
        const userToken = req.headers.authorization;
        const { surveyTitle, description, closingDate } = req.body;

        const { userId } = jwt.decode(userToken, jwtSecret);

        const surveyId = await prisma.survey.create({
            data: {
                userId: userId,
                surveyTitle: surveyTitle,
                description: description || null,
                closingDate: closingDate || null
            },
            select: {
                id: true
            }
        });

        return res.status(200).json({
            surveyId,
            message: "Survey Created!"
        })

    } catch (err) {
        console.log("Error ", err);
        return res.status(500).json({
            message: "Unable to create survey"
        })
   }
})

surveyRouter.put('/:id', async (req, res) => {
    try {
        const surveyPayload = req.body;
        const surveyId = parseInt(req.params.id);

        await prisma.survey.update({
            where: { id: surveyId },
            data: {
                surveyTitle: surveyPayload.surveyTitle,
                description: surveyPayload.description || null,
                closingDate: surveyPayload.closingDate || null
            }
        })

        return res.status(200).json({
            surveyId,
            message: "Survey Updated!"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to update survey"
        })
    }
})

surveyRouter.delete('/:id', async (req, res) => {
    try {
        const surveyId = parseInt(req.params.id);

        await prisma.$transaction(async (prisma) => {
            await prisma.survey.update({
                where: { id: surveyId },
                data: {
                    isDeleted: true,
                }
            });

            await prisma.question.updateMany({
                where: { surveyId: surveyId },
                data: {
                    isDeleted: true,
                }
            })

            const questionIds = await prisma.question.findMany({
                where: { surveyId: surveyId },
                select: { id: true }
            }).then((questions) => {
                return questions.map((question) => {
                    return question.id;
                })
            })

            await prisma.option.updateMany({
                where: { 
                    questionId: { in: questionIds }
                },
                data: {
                    isDeleted: true
                }
            })

        });

        return res.status(200).json({
            message: "Deleted Survey!"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message:  "Unable to delete survey"            
        })
    }
})

module.exports = surveyRouter