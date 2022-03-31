const urls = {
  /**
   * This function will read the link string from header and return array of paginated routes till last page
   * @param {string} link - The link which we got from the first github API call contains next and last URL
   * @returns {array} routes - Retrurns array of all paginated routes till the last page
   */
  async getURLs(link) {
    try {
      // Initial values
      let routes = []
      let nextURL = ''
      let lastURL = ''
      let next = ''
      let last = ''
      const nextBegin = '<'
      const nextEnd = '>; rel="next", <'
      const lastBegin = 'next", <'
      const lastEnd = '>; rel="last"'

      if (link !== undefined) {
        // Fetching next and last URL from the link
        nextURL = await link.substring(
          link.indexOf(nextBegin),
          link.indexOf(nextEnd),
        )
        lastURL = await link.substring(
          link.indexOf(lastBegin),
          link.indexOf(lastEnd),
        )

        next = await nextURL.replace(nextBegin, '')
        last = await lastURL.replace(lastBegin, '')
        const pattern = /.*(\?page=)|(&per_page=).*/
        const regex = new RegExp(pattern, 'g')
        // eslint-disable-next-line radix
        const nextInt = parseInt(next.replace(regex, ''), 0)
        // eslint-disable-next-line radix
        const lastInt = parseInt(last.replace(regex, ''), 0)
        let url = ''
        const begin = /.*(\?page=)/
        const end = /(&per_page=).*/
        let urlBegin = next.replace(end, '')
        let urlEnd = next.replace(begin, '')
        let start = urlBegin.slice(0, urlBegin.length - 1)
        let finish = urlEnd.slice(1)
        // Pushing next URL into routes array
        routes.push(next)

        // Pushing all the generated next URLs into routes array
        if (lastInt - nextInt > 1) {
          for (let i = nextInt + 1; i < lastInt; i++) {
            url = start + i + finish
            routes.push(url)
          }
        }

        // Pushing last URL into routes array
        routes.push(last)

        return routes
      }
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = urls
