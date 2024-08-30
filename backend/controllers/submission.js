const jwt = require('jsonwebtoken');
const { prisma, jwtSecret } = require('../config')

const fetchResponses = async (req, res) => {
    const surveyId = parseInt(req.params.id);
    try {
        const responses = await prisma.submission.findMany({
            where: { surveyId, isDeleted: false },
            select: {
                isAnonymous: true,
                
            }
        })

        res.status(200).json({
            responses,
            message: "Responses fetched!"
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Unable to fetch responses"
        })
    }
}

const submitResponse = async (req, res) => {
    let isSubmitted = false;
    const userToken = req.headers.authorization;
    const { surveyId, isAnonymous, userResponse } = req.body;

    try {
        const { userId } = jwt.decode(userToken, jwtSecret);
        if (!userId) throw new Error("Invalid User id");
        
        const { isPublished } = await prisma.survey.findFirst({
            where: { id: parseInt(surveyId) },
            select: { isPublished: true }
        })

        if(!isPublished) {
            return res.status(400).json({
                message: "Survey is not published"
            })
        }

        await prisma.$transaction(async (tx) => {
            let validAnswers = [];
            let checkboxResponseOptionId = [];
            userResponse.forEach((question) => {
                switch(question.type) {
                    case 'SINGLE_SELECT': if(question.answer) validAnswers.push(question)
                    break;

                    case 'MULTIPLE_SELECT': if(question.answer.length > 0) validAnswers.push(question)
                    break;

                    case 'TEXT': if(question.answer.length > 0) validAnswers.push(question)
                    break;
                }
            })

            console.log(validAnswers);

            const { id: submissionId } = await tx.submission.create({
                data: {
                    userId: parseInt(userId),
                    isAnonymous: isAnonymous,
                    surveyId: parseInt(surveyId)
                },
                select: { id: true, userId: true , isAnonymous: true, surveyId: true }
            })

            console.log(submissionId);

            await tx.answer.createMany({
                data: validAnswers.map((answer) => {
                    let data;
                    switch(answer.type) {
                        case 'SINGLE_SELECT': {
                            data = {
                                submissionId: submissionId,
                                questionId: answer.questionId,
                                multipleChoiceOptionId: parseInt(answer.answer),
                                textResponse: null
                            }
                        } break;
        
                        case 'MULTIPLE_SELECT': {
                            checkboxResponseOptionId.push(answer.answer);
                            data = {
                                submissionId: submissionId,
                                questionId: answer.questionId,
                                multipleChoiceOptionId: null,
                                textResponse: null
                            }
                        } break;
        
                        case 'TEXT': {
                            data = {
                                submissionId: submissionId,
                                questionId: answer.questionId,
                                multipleChoiceOptionId: null,
                                textResponse: answer.answer
                            }
                        } break;
                    }

                    return data;
                })
            })

            const checkboxResponseAnswerIds = tx.answer.findMany({
                where: {
                    submissionId: submissionId,
                    question: { type: 'MULTIPLE_SELECT' }
                },
                select: { id: true }
            })

            console.log(checkboxResponseAnswerIds, checkboxResponseOptionId);

            isSubmitted = true;
        })

        if(isSubmitted) {
            return res.status(200).json({
                message: "Response submitted!"
            })
        } else {
            return res.status(500).json({
                message: "Response submission failed"
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to submit response"
        })
    }
}

module.exports = {
    fetchResponses,
    submitResponse
}