const { prisma } = require('./config');

const runScheduledTasks = async () => {
    try {
        setInterval(async () => {
            const currentTime = new Date().toISOString();
            await prisma.survey.updateMany({
                where: {
                    closingDate: { lte: currentTime }
                },
                data: {
                    closingDate: null,
                    isClosed: true
                }
            });
        }, 60 * 1000)
        
    } catch (err) {
        console.error('Unable to run schedule')
    }
}

module.exports = runScheduledTasks
