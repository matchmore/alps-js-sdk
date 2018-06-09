
const storage = {
  save: (key, value) => window.localStorage.setItem(key, value),
  load: (key) => window.localStorage.getItem(key),
  remove: (key) => window.localStorage.removeItem(key),
}