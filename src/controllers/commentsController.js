const githubService = require('../services/githubService')
const refineData = require('../helpers/refineData')
const reportData = require('../helpers/reportData')

const commentsController = {
  /**
   * function to get comments from the repository
   * @param {string} repo - repository name
   * @param {string} dateISOString - date as ISOString format
   */
  async getComments(repo, dateISOString) {
    try {
      let comments = await githubService.getGitData({
        repo,
        dateISOString,
        typeOfOperation: 'comments',
      })
      let issues = await githubService.getGitData({
        repo,
        dateISOString,
        typeOfOperation: 'issues',
      })
      let pulls = await githubService.getGitData({
        repo,
        dateISOString,
        typeOfOperation: 'pulls',
      })
      let stats = await githubService.getGitStatsData(repo)

      // to collect resultant data
      let totalData = []

      if (comments.length) {
        totalData.push(comments)
      }

      if (issues.length) {
        totalData.push(issues)
      }

      if (pulls.length) {
        totalData.push(pulls)
      }

      if (stats.length) {
        totalData.push(stats)
      }

      // Refining the totalData i.e combining and sorting
      let refinedData = await refineData.getRefinedData(totalData)

      reportData.getReport(refinedData)
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = commentsController
