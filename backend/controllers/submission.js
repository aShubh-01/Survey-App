const jwt = require('jsonwebtoken');
const { prisma, jwtSecret } = require('../config')

const fetchResponses = async (req, res) => {
    const surveyId = parseInt(req.params.id);
    try {
        let responsesData = await prisma.submission.findMany({
            where: { surveyId },
            select: {
                users: { 
                    select: { email: true }
                },
                isAnonymous: true,
                answers: {
                    select: {
                        question: { select: { questionLabel: true } },
                        multipleChoiceResponse: { select: { optionLabel: true } },
                        checkboxResponses: { select: { option: { select: { optionLabel: true } } } },
                        textResponse: true,
                    }
                }
            },
        })

        let statisticsData = await prisma.survey.findFirst({
            where: { id: surveyId },
            select: {
                surveyTitle: true,
                description: true,
                    questions: {
                        where: { surveyId },
                        select: {
                            id: true,
                            questionLabel: true,
                            type: true,
                            _count: { select: { attempts: true } },
                            attempts: { 
                                where: { textResponse: { not: null } },
                                select: { textResponse: true }
                            },
                            options: {
                                where: { question: { surveyId } },
                                select: {
                                optionLabel: true,
                                _count: { select: {
                                    multipleChoiceReponses: true,
                                    checkboxesResponses: true,
                                }},
                            },
                        }
                    }
                }
            }
        })

        statisticsData = statisticsData.questions.sort((a, b) => a.id - b.id)
        
        statisticsData = statisticsData.map((question) => {
            switch(question.type) {
                case 'SINGLE_SELECT' : {
                    question.attempts = question._count.attempts;
                    question.options = question.options.map((option) => {
                        option.votes = option._count.multipleChoiceReponses;
                        delete option._count;
                        return option
                    })
                } break;

                case 'MULTIPLE_SELECT' : {
                    question.attempts = question._count.attempts;
                    question.options = question.options.map((option) => {
                        option.votes = option._count.checkboxesResponses;
                        delete option._count;
                        return option
                    })
                } break;

                case 'TEXT' : {
                    question.textResponses = question.attempts.map((textResponse) => {
                        return textResponse.textResponse;
                    });
                    question.attempts = question._count.attempts;
                    delete question.options;
                } break;
            }
            delete question._count;
            return question;
        })

        responsesData = responsesData.map((response) => {
            if(!response.isAnonymous) response.userEmail = response.users.email
            delete response.users

            response.answers = response.answers.map((answer) => {
                answer.questionLabel = answer.question.questionLabel;
                delete answer.question;

                if(answer.checkboxResponses.length < 1) delete answer.checkboxResponses
                else answer.checkboxResponses = answer.checkboxResponses.map((option) => {
                    return option.option.optionLabel;
                })

                if(answer.multipleChoiceResponse == null) delete answer.multipleChoiceResponse
                else answer.multipleChoiceResponse = answer.multipleChoiceResponse.optionLabel

                if(answer.textResponse == null) delete answer.textResponse
                return answer
            })
            return response
        })

        res.status(200).json({
            statisticsData: statisticsData,
            responsesData: responsesData,
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
            let checkboxResponseOptionIds = [];
            let checkboxResponses = [];
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

            const { id: submissionId } = await tx.submission.create({
                data: {
                    userId: parseInt(userId),
                    isAnonymous: isAnonymous,
                    surveyId: parseInt(surveyId)
                },
                select: { id: true, userId: true , isAnonymous: true, surveyId: true }
            })

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
                            checkboxResponseOptionIds.push(answer.answer);
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

            const checkboxResponseAnswerIds = await tx.answer.findMany({
                where: {
                    submissionId: submissionId,
                    question: { type: 'MULTIPLE_SELECT'}
                },
                select: { id: true }
            })

            for(let index = 0; index < checkboxResponseAnswerIds.length; index++){
                checkboxResponseOptionIds[index].forEach((id) => {
                    checkboxResponses.push({
                        answerId: checkboxResponseAnswerIds[index].id,
                        optionId: parseInt(id)
                    })
                })
            }

            await tx.checkboxesResponse.createMany({
                data: checkboxResponses
            })

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