const { Worker } = require('bullmq')

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    console.log('📧 Sending email to:', job.data.email)

    // simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('✅ Email sent to:', job.data.email)
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  }
)

module.exports = emailWorker
