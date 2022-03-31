module.exports = {
  GITHUB_PERSONAL_ACCESS_TOKEN: require('./token'),
  BaseURL: 'https://api.github.com/repos/',
  CommentsURL: '/comments?page=1&per_page=100',
  IssuesURL: '/issues/comments?page=1&per_page=100',
  PullsURL: '/pulls/comments?page=1&per_page=100',
  StatsURL: '/stats/contributors',
}
