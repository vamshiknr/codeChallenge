const commentsHelper = {
  /**
   * Function to collect users data
   * @param {object} users - users object
   * @returns {object} comments - as formatted data template
   */
  async getCommentsData(users) {
    try {
      const comments = []
      const uniqueUsers = []

      await users.map((login) => {
        if (!uniqueUsers.includes(login)) {
          uniqueUsers.push(login)

          comments.push({
            login: login,
            comments: 0,
            total: 0,
          })
        }
      })

      // Map all users to unique data template
      await users.map((login) => {
        uniqueUsers.map((unique) => {
          if (login === unique) {
            let index = comments.findIndex(
              (comment) => comment.login === unique,
            )
            comments[index]['comments'] += 1
          }
        })
      })

      return comments
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = commentsHelper
