const jwt = require('jsonwebtoken');
const { prisma, jwtSecret } = require('../config');
const { surveySchema } = require('../schemas/surveySchema');

const getSurveys = async (req, res) => {
    try {
        const userId = req.userId;
        const allSurveys = await prisma.survey.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                isClosed: true,
                isPublished: true,
                surveyTitle: true,
                description: true,
                _count: { select: {
                    submission: true,
                    questions: true
                }},
                questions: {
                    select: {
                        id: true,
                        questionLabel: true,
                        type: true,
                        isRequired: true,
                        options: {
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
}

const publishSurvey = async (req, res) => {
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
}

const toggleSubmissionAllowance = async (req, res) => {
    const surveyId = parseInt(req.params.id);
    const userId = req.userId;

    try {
        const { isClosed } = await prisma.survey.findFirst({

            where: { id: surveyId, userId },
            select: { isClosed: true } 
        });

        await prisma.survey.update({
            where: { id: surveyId, userId },
            data: { isClosed: !isClosed}
        })

        if(!isClosed) {
            res.status(200).json({
                message: "Submissions Closed"
            })
        } else {
            res.status(200).json({
                message: "Submissions Open"
            })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Unable to toggle submission"
        })
    }
}

const getSurvey = async(req, res) => {

    const surveyId = parseInt(req.params.id);
    const userId = req.userId;

    try {
        const isAlreadySubmitted = await prisma.submission.findFirst({
            where: {
                userId: userId,
                surveyId: surveyId
            },
            select: { id: true }
        })
    
        if(isAlreadySubmitted) return res.status(200).json({
            message: 'Response Already Submitted'
        })

        const { isClosed } = await prisma.survey.findFirst({
            where: { id: surveyId },
            select: { isClosed: true }
        })

        if(isClosed) return res.status(200).json({
            message: 'Survey is Closed'
        })
    
        const survey = await prisma.survey.findFirst({
            where: {
                id: surveyId,
                isPublished: true,
            },
            select: {
                id: true,
                surveyTitle: true,
                description: true,
                isClosed: true,
                questions: {
                    select: {
                        id: true,
                        questionLabel: true,
                        type: true,
                        isRequired: true,
                        options: {
                            select: {
                                id: true,
                                optionLabel: true
                            }
                        }
                    }
                }
            }
        });
    
        survey.questions.sort((a, b) => a.id - b.id);
        survey.questions.map((question) => {
            question.options.sort((a, b) => a.id - b.id)
        })
        
        return res.status(200).json({
            survey
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'Unable to fetch survey'
        })
    }
}

const createSurvey =  async (req, res) => {
    try {
        const userToken = req.headers.authorization;
        const { surveyTitle, description } = req.body;

        const { userId } = jwt.decode(userToken, jwtSecret);

        const parseResponse = surveySchema.safeParse(req.body);
        if(!parseResponse.success) {
            return res.status(500).json({
                message: "Invalid survey schema",
                issues: parseResponse.error.issues
            })
        }

        const { id: surveyId} = await prisma.survey.create({
            data: {
                userId: userId,
                surveyTitle: surveyTitle,
                description: description || null
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
}

const updateSurvey = async (req, res) => {
    try {
        const surveyId = parseInt(req.params.id);

        const parseResponse = surveySchema.safeParse(req.body);
        if(!parseResponse.success) {
            return res.status(500).json({
                message: "Invalid survey schema",
                issues: parseResponse.error.issues
            })
        }

        await prisma.survey.update({
            where: { id: surveyId },
            data: req.body
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
}

const deleteSurvey = async (req, res) => {
    try {
        const surveyId = parseInt(req.params.id);
        const userId = req.userId;

        await prisma.survey.delete({
            where: { id: surveyId, userId }
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
}

module.exports = {
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurvey,
    getSurveys,
    publishSurvey,
    toggleSubmissionAllowance
}