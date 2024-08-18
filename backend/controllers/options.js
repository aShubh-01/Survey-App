const { prisma } = require('../config')
const { optionSchema } = require('../schemas/surveySchema');

const createOption = async (req, res) => {
    const parseResponse = optionSchema.safeParse(req.body);
    if(!parseResponse.success){
        return res.status(500).json({
            message: "Invalid option schema",
            issues: parseResponse.error.issues
        })
    }

    try {
        const { optionLabel, questionId } = req.body;
        
        const { id: optionId} = await prisma.option.create({
            data: {
                questionId: parseInt(questionId),
                optionLabel: optionLabel
            },
            select: {
                id: true
            }
        })

        return res.status(200).json({
            optionId,
            message: "Option Created!"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to create option"
        })
    }
}

const updateOption = async (req, res) => {
    
    const parseResponse = optionSchema.safeParse(req.body);
    if(!parseResponse.success){
        return res.status(500).json({
            message: "Invalid option schema",
            issues: parseResponse.error.issues
        })
    }

    try {
        const optionId = parseInt(req.params.id);
        const { optionLabel } = req.body;
        await prisma.option.update({
            where: {
                id: optionId
            },
            data: {
                optionLabel: optionLabel
            }
        })

        return res.status(200).json({
            optionId,
            message: "Option Updated"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
           message: "Unable to update option"
        })
    }
}

const deleteOption = async (req, res) => {
    try {
        const optionId = parseInt(req.params.id);
        await prisma.option.update({
            where: {
                id: optionId
            },
            data: {
                isDeleted: true
            }
        });
        return res.status(200).json({
            message: "Option Deleted!"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to delete option"
        })
    }
}

module.exports = {
    createOption,
    updateOption,
    deleteOption
}