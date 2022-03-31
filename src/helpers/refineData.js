const refineData = {
  /**
   * This function will wrapp all data into one array and get unique users and sorted out the data
   * @param {object} totalData - complete comments from the github APIs
   * @returns {object} sortedUsers - unique sorted response
   */
  async getRefinedData(totalData) {
    try {
      let users = []
      let uniqUsers = []

      // Add number of array objects to one array
      await totalData.map((response) => {
        response.map((data) => {
          users.push(data)
        })
      })

      await users.map((user) => {
        if (!uniqUsers.includes(user.login)) {
          uniqUsers.push(user.login)
        }
      })

      // Return refined user data
      await uniqUsers.map((login, i) => {
        users.map((user) => {
          // Initial values
          let comments = 0
          let total = 0

          if (login === user.login) {
            // Update value if properties exist
            if (uniqUsers[i].comments) {
              comments = uniqUsers[i].comments
            }

            if (uniqUsers[i].total) {
              total = uniqUsers[i].total
            }

            // Return an object in custom mapped array
            uniqUsers[i] = {
              login: login,
              comments: (comments += user.comments),
              total: (total += user.total),
            }

            return uniqUsers[i]
          }
        })
      })

      // Sort by Comments
      let sortedUsers = await uniqUsers.sort((a, b) => b.comments - a.comments)

      return sortedUsers
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = refineData
