const axios = require('axios')
const cheerio = require('cheerio')

const BASE = 'http://wallpaperswide.com'
const RESOLUTION = '1980x1080'

function getWallpapers (category, pagination = 1, cb) {
  axios.get(`${BASE}/${category.toLowerCase()}-desktop-wallpapers/page/${pagination}`).then(res => {
    console.log(res)
    const $ = cheerio.load(res.data)
    const pagination = $('.pagination').text().replace(/« Previous|Next »/g, '')
    const pageAmount = Number(pagination.charAt(pagination.length - 1))
    const currentList = $('.wallpapers').find('.wall').map((i, elm) => {
      const name = $(elm).find('h1').text().toLowerCase().replace(/\s+/g, '_')
      const thumbImg = $(elm).find('.thumb_img').attr('src')
      const downloadUrl = `${BASE}/download/${name}-wallpaper-${RESOLUTION}.jpg`
      return {
        name,
        thumbImg,
        downloadUrl
      }
    }).get()
    cb(currentList, pageAmount)
  })
}

getWallpapers('Areo', 1, (currentList, pageAmount) => {
  console.log(currentList, pageAmount)
})

module.exports = getWallpapers
