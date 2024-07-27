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
    const userToken = req.headers.authorization;
    const { isAnonymous, surveyId, userResponse } = req.body;

    try {
        const { userId } = jwt.decode(userToken, jwtSecret);
        if (!userId) throw new Error("Invalid User id");

        await prisma.$transaction(async (prisma) => {

            const questionIds = [], optionsIds = [];

            userResponse.forEach((response) => {

                questionIds.push(response.questionId);

                if (response.questionType === 'MULTIPLE_SELECT') {
                    response.answer.forEach((ans) => {
                        optionsIds.push(ans)
                    })
                } else if (response.questionType === 'SINGLE_SELECT') {
                    optionsIds.push(response.answer);
                }
            })

            const { id: submissionId } = await prisma.submission.create({
                data: {
                    userId: userId,
                    isAnonymous: isAnonymous,
                    surveyId: surveyId,
                },
                select: { id: true }
            });

            const answerPromises = userResponse.map((response) => {
                switch (response.questionType) {
                    case "SINGLE_SELECT": {
                        return prisma.answer.create({
                            data: {
                                submissionId: submissionId,
                                questionId: response.questionId,
                                optionId: response.answer
                            }
                        });
                    } break;

                    case "MULTIPLE_SELECT": {
                        return Promise.all(
                            response.answer.map((ans) => {
                                return prisma.answer.create({
                                    data: {
                                        submissionId: submissionId,
                                        questionId: response.questionId,
                                        optionId: ans
                                    }
                                });
                            }));
                    } break;

                    case "TEXT": {
                        return prisma.answer.create({
                            data: {
                                submissionId: submissionId,
                                questionId: response.questionId,
                                textResponse: response.answer
                            }
                        });
                    } break;

                    default:
                        return Promise.resolve();
                }
            });

            await Promise.all(answerPromises.flat());

            await prisma.question.updateMany({
                where: { id: { in: questionIds } },
                data: { attempts: { increment: 1 } }
            })

            await prisma.option.updateMany({
                where: { id: { in: optionsIds } },
                data: { votes: { increment: 1 } }
            })

            isSubmitted = true;
            console.log('Response submitted for ', userId + " " + surveyId)
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
            message: "Unable to submit answers"
        })
    }
}

module.exports = {
    fetchResponses,
    submitResponse
}