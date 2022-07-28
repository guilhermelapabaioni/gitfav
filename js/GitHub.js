export class GithubUser {
  static search(username) {
    const gitAPI = `https://api.github.com/users/${username}`

    return fetch(gitAPI)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}
