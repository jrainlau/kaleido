import Datastore from 'nedb'

const db = new Datastore({
  filename: 'loadedCategory.db',
  autoload: true
})

export default {
  db,
  insert (doc) {
    return new Promise((resolve, reject) => {
      db.insert(doc, (err, newDoc) => {
        if (err) reject(err)
        resolve(newDoc)
      })
    })
  },
  find (content) {
    return new Promise((resolve, reject) => {
      db.find(content, (err, docs) => {
        if (err) reject(err)
        resolve(docs)
      })
    })
  },
  update (query, update, options = {}) {
    return new Promise((resolve, reject) => {
      db.update(query, update, options, (err, numReplaced) => {
        if (err) reject(err)
        resolve(numReplaced)
      })
    })
  },
  remove (query, options) {
    return new Promise((resolve, reject) => {
      db.remove(query, options, (err, numRemoved) => {
        if (err) reject(err)
        resolve(numRemoved)
      })
    })
  }
}
