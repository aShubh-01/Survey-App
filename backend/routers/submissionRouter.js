const express = require('express');
const jwt = require('jsonwebtoken');
const { checkUser } = require('./middlewares/userAuth');
const { prisma, jwtSecret } = require('../config')

const submissionRouter = express.Router();

submissionRouter.get('/responses/:id', async (req, res) => {
    const surveyId = parseInt(req.params.id);
    let isSubmitted = false;
    try {
        const responses = await prisma.submission.findMany({
            
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
});

submissionRouter.post('/', async (req, res) => {
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

            console.log('Question Ids - ', questionIds);
            console.log('Option Ids - ', optionsIds);

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
                    }

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
                    }

                    case "TEXT": {
                        return prisma.answer.create({
                            data: {
                                submissionId: submissionId,
                                questionId: response.questionId,
                                textResponse: response.answer
                            }
                        });
                    }

                    default:
                        return Promise.resolve();
                }
            });

            await Promise.all(answerPromises.flat());

            console.log("Answers recorded")

            await prisma.question.updateMany({
                where: { id: { in: questionIds } },
                data: { attempts: { increment: 1 } }
            })

            console.log('Attempts updated');

            prisma.option.updateMany({
                where: { id: { in: optionsIds } },
                data: { votes: { increment: 1 } }
            })

            console.log('Votes updated')

            isSubmitted = true;

        })

        if(isSubmitted) {
            return res.status(200).json({
                message: "Response submitted!"
            })
        } else {
            return res.status(500).json({
                message: "Response not submitted!"
            })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to submit answers"
        })
    }
})

module.exports = submissionRouter;