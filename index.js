const minimist = require('minimist')
const chalk = require('chalk')
let commentsController = require('./src/controllers/commentsController')

/**
 * Process request by collecting arguments (Repository and timeperiod)
 */
try {
  let argv = minimist(process.argv)

  const repo = argv.repo
  const period = argv.period

  if (typeof repo === 'string' && repo.match(/(\w)|(\/)|(-)/g)) {
    let days = 0
    if (typeof period === 'string' && period.includes('d')) {
      days = period.replace(/([d])/g, '')
    }
    const time = parseInt(days, 0)
    let dateISOString = ''
    if (time !== 0) {
      let date = new Date()
      date.setDate(date.getDate() - time)
      dateISOString = date.toISOString().replace(/(\..*)/g, 'Z')
    }

    console.log('\n')
    console.log(`Fetching comments for past ${days} days for ${repo}`)
    console.log('\n')

    // Start getting comments data
    commentsController.getComments(repo, dateISOString)
  } else {
    console.log(chalk.red('Invalid repo, try again with valid repo.'))
  }
} catch (error) {
  console.error(error)
}
