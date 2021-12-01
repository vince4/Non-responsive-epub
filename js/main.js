// const ePub = ePubModule.default

let book
let rendition
let pageIndex

const requestAnimationFrame = (typeof window != "undefined") ? (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) : false

/**
 * Open and display ePub book
 * @param {object} [data]
 * @param {string} [data.path] ePub path to open
 * @param {number} [data.pageIndex]
 * @param {string} [data.spineID] id of spine to open
 * @param {object} [data.settings]
 * @param {object} [data.settings.theme] css rules applied to reader
 */
function openBook(data) {
  pageIndex = data.pageIndex
  let spineID = data.spineID

  book = ePub(data.path)

  loadBook(book, spineID, data.settings)
}

function loadBook(book, spineID, settings) {
  rendition = book.renderTo('ybx_viewer', {
    flow: 'paginated',
    width: "390px",   // We specify an iPhone 13 screen size
    height: "844px",  // We specify an iPhone 13 screen size
    snap: true,
    spread: 'none'
  })

  loadBookRendition(rendition, spineID, settings)
}

function loadBookRendition(rendition, spineID, settings) {
  setViewerTheme(settings.theme)

  // Display the targeted spine inside the ePub. 
  // Even if the ePub contains only one file, you need to specify an id to display non linear spines.
  rendition.display('#' + spineID)

  rendition.on('rendered', (section, view) => {
    onRendered(section, view)
  })
}

function onRendered(section, view) {
  // We need to call requestAnimationFrame to get real column count
  requestAnimationFrame(function() { 
    relocatePageIndex(rendition, pageIndex) 
  })
}

function relocatePageIndex(rendition, index) {
  forceResize(rendition) // Update totalPage
  
  scrollToPage(pageIndex) // Scroll to pageIndex

//  fixWebKitPagination(location) // Apply a hack to fix a WebKit pagination bug
}

function forceResize(rendition) {
  if (rendition.getContents()[0] === undefined) return
  rendition.getContents()[0].expand()
}

function setViewerTheme(theme) {
  if (theme === undefined) return
  rendition.themes.registerRules('youboox-theme', theme)
  rendition.themes.select('youboox-theme')
}

function scrollToPage(pageNb) {
  const manager = rendition.manager
  if (manager === undefined) return

  manager.scrollTo(pageNb * manager.layout.delta, 0, true)
}

/**
 * WebKit has a layout bug when applying css column.
 * Sometimes it add a blank column at the end of chapter
 * To fix it, we check the position of last page cfi
 * @param {Object} location epub.js location
 */
//function fixWebKitPagination(location) {
//  const manager = rendition.manager
//  if (manager === undefined) return
//
//  const view = manager.views.first()
//  if (view === undefined) return
//
//  const viewContent = view.contents
//  if (viewContent === undefined) return
//
//  manager.updateLayout()
//
//  if(!manager.isPaginated || manager.settings.axis !== "horizontal") return
//
//  const contentWidth = view.width()
//  const pageWidth = manager.layout.width
//
//  const endPos = contentWidth;
//  const startPos = endPos - pageWidth;
//
//  const mapping = manager.mapping.page(view.contents, view.section.cfiBase, startPos, endPos)
//
//  const page = paginatedPageOfCfi(mapping.end, viewContent, manager)
//
//  const total = page + 1
//
//  location.start.displayed.total = total
//  location.end.displayed.total = total
//
//  return total
//}

// These methods could be added to default manager.
// It makes the same as paginatedLocation().
// 
// /**
//  * Get chapter page index from EpubCFI
//  * @param {string} cfi EpubCfi String
//  * @param {Content} content
//  * @param {Manager} manager
//  * @returns {Number}
//  */
// function paginatedPageOfCfi(cfi, content, manager) {
//   const position = content.locationOf(cfi)
//   return paginatedPageOfPosition(position, manager)
// }

// /**
//  * Convert position in spine to page index
//  * @param {left: Number, top: Number} position
//  * @param {Manager} manager
//  * @returns {Number}
//  */
// function paginatedPageOfPosition(position, manager) {
//   const left = position.left

//   return Math.floor(left / manager.layout.pageWidth)
// }
