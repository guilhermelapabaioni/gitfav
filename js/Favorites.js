import { GithubUser } from './GitHub.js'

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    this.viseble()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  viseble() {
    const tbody = this.root.querySelector('table tbody')
    const noFav = this.root.querySelector('.noFav')
    if (this.entries.length == []) {
      noFav.classList.add('show')
    } else {
      noFav.classList.remove('show')
      tbody.classList.add('show')
    }
  }

  async add(username) {
    try {
      const { value } = this.root.querySelector('.fav input')
      const userExists = this.entries.find(
        entry => entry.login === username || entry.login === value.toUpperCase()
      )

      if (userExists) {
        throw new Error('Usuário já favoritado!')
      }
      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.addView()
  }

  addView() {
    const addButton = this.root.querySelector('.add')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.fav input')
      this.add(value)
    }
  }

  update() {
    this.viseble()
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Image of ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const itsOk = confirm('Deseja remover?')
        if (itsOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove(tr))
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
        <img src="" alt=""/>
        <a href="">
          <p></p>
          <span></span>
        </a>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td>
        <button class="remove">Remove</button>
      </td>
      `
    return tr
  }
}
