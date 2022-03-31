const axios = require('axios').default
const config = require('../config')
const urls = require('../helpers/urls')
const commentsHelper = require('../helpers/commentsData')
const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
}

const githubService = {
  /**
   * This function will get comments from github API (Comments API, issues API and pulls API)
   * @param {object} args - Object which contains repo, dateISOString and typeOfOperation
   * @returns {object} commentsData - comments data
   * typeOfOperation will be a string and possible values are 'comments' or 'pulls', or 'issues'
   */
  async getGitData(args) {
    try {
      let { repo, dateISOString, typeOfOperation } = args
      let comments = []

      // since parameter for issues and pulls API
      let since = '&since=' + dateISOString
      since += '&sort=created&direction=desc'

      // Getting endpoint from config based on typeOfOperation
      let endURL
      if (typeOfOperation === 'comments') {
        endURL = config.CommentsURL
      } else if (typeOfOperation === 'issues') {
        endURL = config.IssuesURL + since
      } else if (typeOfOperation === 'pulls') {
        endURL = config.PullsURL + since
      }

      const date = new Date(dateISOString)

      // GitHub API get call
      let response = await axios.get(`${config.BaseURL}${repo}${endURL}`, {
        headers: headers,
      })

      if (response.statusText === 'OK') {
        // Pushing data to comments array
        comments.push(...response.data)
        if (response.headers['link'] !== undefined) {
          // if there is a link in headers, then generating all the links with the page number
          let routes = await urls.getURLs(response.headers['link'])

          // GitHub API get call for all pages and pushing data to comments array
          let axiosGetCalls = []
          for (const url of routes) {
            axiosGetCalls.push(
              axios.get(url, {
                headers: headers,
              }),
            )
          }

          const res = await Promise.all(axiosGetCalls)
          comments.push(res.map((res) => res.data))
        }

        let users = []
        // Filtering data by DateTime if 'comments', otherwise ignoring Datetime in case of 'issues' and 'pulls'
        await comments.map((stats) => {
          if (typeOfOperation === 'comments') {
            let fetchDate = new Date(stats.created_at)
            if (fetchDate > date) {
              if (stats.user['login']) {
                users.push(stats.user['login'])
              }
            }
          } else if (
            typeOfOperation === 'pulls' ||
            typeOfOperation === 'issues'
          ) {
            if (stats.user['login']) {
              users.push(stats.user['login'])
            }
          }
        })

        // Templating the comments data
        let commentsData = await commentsHelper.getCommentsData(users)
        return commentsData
      }
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * This function will get comments from github stats API
   * @param {string} repo - repo name which we need to get comments
   * @returns {object} commentsData - comments data
   */
  async getGitStatsData(repo) {
    try {
      const commentsData = []

      // GitHub API get call
      let response = await axios.get(
        `${config.BaseURL}${repo}${config.StatsURL}`,
        {
          headers: headers,
        },
      )

      if (response.statusText === 'OK') {
        // Filtering and Templating the comments data
        await response.data.map((stats) => {
          if (stats.author['login']) {
            commentsData.push({
              login: stats.author['login'],
              comments: 0,
              total: stats.total,
            })
          }
        })
      }

      return commentsData
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = githubService
