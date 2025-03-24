console.info('[3dvista] init.js loaded')
let fullscreenBtnEl = null
let fullscreenBtnLabelEl = null

function onTourLoaded() {
  if (!tour) {
    console.error('[3dvista] Tour not found')
  }
  console.info('[3dvista] Tour loaded!')
  tour.pause()
  // add fullscreen capability to external buttons
  fullscreenBtnEl = document.getElementById('fullscreen-btn')
  if (fullscreenBtnEl) {
    fullscreenBtnEl.remove()
  }
  // Create the fullscreen button element and assign an id
  fullscreenBtnEl = document.createElement('button')
  fullscreenBtnEl.id = 'fullscreen-btn'
  // append a scg code
  const svgCode = `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M7 21L17 21" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2 16.4V3.6C2 3.26863 2.26863 3 2.6 3H21.4C21.7314 3 22 3.26863 22 3.6V16.4C22 16.7314 21.7314 17 21.4 17H2.6C2.26863 17 2 16.7314 2 16.4Z" stroke="#ffffff" stroke-width="1.5"></path></svg>`
  fullscreenBtnEl.innerHTML = svgCode
  // create a span element to hold the label
  const fullscreenBtnLabelEl = document.createElement('span')
  fullscreenBtnLabelEl.id = 'fullscreen-btn-label'
  fullscreenBtnLabelEl.innerHTML = 'Fullscreen'
  fullscreenBtnEl.appendChild(fullscreenBtnLabelEl)

  document.body.appendChild(fullscreenBtnEl)

  if (window.parent) {
    window.parent.postMessage({ type: 'onTourLoaded' }, '*')
  }

  if (fullscreenBtnEl) {
    fullscreenBtnEl.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  onTourLoaded()
})

window.addEventListener('message', function (event) {
  console.info('[3dvista] Message received from parent:', event.data)

  const { type, route } = event.data
  if (type === 'navigate') {
    console.info('[3dvista] Navigating to:', route)
    if (tour && !isNaN(route)) {
      try {
        tour.setMediaByIndex(route)
      } catch (error) {
        console.error('[3dvista] Error navigating:', event, error)
      }
    }
  }
})

document.addEventListener('fullscreenchange', function () {
  console.log('Fullscreen change detected')
  const label = document.getElementById('fullscreen-btn-label')
  if (document.fullscreenElement && label) {
    console.log('Entered Fullscreen')
    label.innerHTML = 'Exit Fullscreen'
  } else if (label) {
    console.log('Exited Fullscreen')
    label.innerHTML = 'Fullscreen'
  }
})
// search & replace in script_general.js the manually translated urls
// "click":"this.openEmbeddedPDF\(.*?(this\.translate\('[^']*'\))\)
// "click":"window.dispatchEvent(new CustomEvent('tourElementClick', {detail:{url:$1}}))//
window.addEventListener('tourElementClick', function (e) {
  console.log('@tourElementClick', e.detail.url)
  if (window.parent) {
    window.parent.postMessage({ type: 'PDF', url: e.detail.url }, '*')
  }
})
