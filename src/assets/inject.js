export default `
var paginationArr = document.querySelectorAll('.pagination')
var paginations = paginationArr[paginationArr.length -1].children
var pageAmount = paginations[paginations.length - 2].text
var screenResolution = document.querySelector('#header > div.screen-res > span:nth-child(4) > strong').textContent.replace(/\\s+/g, '')
var wallpaperNodeList = document.querySelectorAll('.wallpapers')
var onShowWallpapers = wallpaperNodeList[wallpaperNodeList.length - 1]
var wallpapers = Array.from(onShowWallpapers.querySelectorAll('img')).map(img => {
  var imgName = img.src.replace(/http:\\/\\/hd\\.wallpaperswide\\.com\\/thumbs\\/|\\-t1\\.jpg/g, '')
  return {
    thumb: img.src,
    name: imgName,
    downloadUrl: 'http://wallpaperswide.com/download/' + imgName + '-wallpaper-' + screenResolution + '.jpg',
    total: pageAmount
  }
})

;(() => {
  return {
    wallpapers: wallpapers
  }
})()
`
