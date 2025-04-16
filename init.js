const isInIframe = window.self !== window.top
console.info('[3dvista] init.js loaded. \n - isInIframe:', isInIframe)

document.addEventListener('fullscreenchange', () => {
  const fsElement = document.fullscreenElement
  if (fsElement) {
    console.log('🚨 Entered fullscreen:', fsElement)
  } else {
    console.log('🟢 Exited fullscreen')
  }
})

const blockFullscreen = (el) => {
  const originalRequest = el.requestFullscreen
  el.requestFullscreen = function () {
    console.log('⚠️ Blocked fullscreen attempt on:', el)
    return Promise.reject('Fullscreen disabled')
  }
}

blockFullscreen(document.getElementById('viewer'))

let controlsWrapperEl = null

let fullscreenBtnEl = null
let fullscreenBtnLabelEl = null

function addZoomControls() {
  const zoomInEl = document.createElement('button')
  zoomInEl.innerHTML = 'Zoom In'
  zoomInEl.addEventListener('click', zoomIn)
  controlsWrapperEl.appendChild(zoomInEl)
}

function onTourLoaded() {
  if (!tour) {
    console.error('[3dvista] Tour not found')
  }
  console.info('[3dvista] Tour loaded!')
  // waitForTDV()
  // addControls()
  // add controls to the tour
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
      console.info('[3dvista] Fullscreen @click')
      if (isInIframe && window.parent.document.fullscreenElement) {
        console.info('[3dvista] Fullscreen @click - exiting fullscreen')
        window.parent.document.exitFullscreen()
      } else if (isInIframe) {
        console.info('[3dvista] Fullscreen @click - entering fullscreen')
        window.parent.document.documentElement.requestFullscreen()
      } else if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  onTourLoaded()
  const div = document.createElement('div')
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

window.parent.addEventListener('fullscreenchange', function () {
  console.log('Fullscreen change detected')
  const label = document.getElementById('fullscreen-btn-label')
  if (isInIframe && window.parent.document.fullscreenElement && label) {
    label.innerHTML = 'Exit Fullscreen'
  } else if (isInIframe && label) {
    label.innerHTML = 'Fullscreen'
  } else if (document.fullscreenElement && label) {
    label.innerHTML = 'Exit Fullscreen'
  } else if (label) {
    label.innerHTML = 'Fullscreen'
  }
})
// search & replace in script_general.js the manually translated urls
// "click":"this.openEmbeddedPDF\(.*?(this\.translate\('[^']*'\))\)
// "click":"window.dispatchEvent(new CustomEvent('tourElementClick', {detail:{url:$1}}))//
window.addEventListener('tourElementClick', function (e) {
  console.log('@tourElementClick', e.detail.url)
  if (isInIframe) {
    window.parent.postMessage({ type: 'PDF', url: e.detail.url }, '*')
  } else {
    const imgUrl = e.detail.url.replace(/\.pdf$/, '-large.png')
    showImageLightbox(imgUrl, e.detail.url)
  }
})

/**
 * Creates a lightbox to display an image from a URL with proper container resizing
 * and a button to view the image externally
 * @param {string} imageUrl - URL of the image to display
 */
/**
 * Creates a lightbox to display an image from a URL with proper container resizing
 * and a button to view the image externally
 * @param {string} imageUrl - URL of the image to display
 */
function showImageLightbox(imageUrl, externalUrl) {
  // Check if lightbox already exists, create if not
  let lightbox = document.getElementById('vanilla-lightbox')

  if (!lightbox) {
    // Create lightbox container
    lightbox = document.createElement('div')
    lightbox.id = 'vanilla-lightbox'
    lightbox.className = 'vanilla-lightbox'

    // Create content wrapper (holds content container and button)
    const contentWrapper = document.createElement('div')
    contentWrapper.id = 'lightbox-wrapper'
    contentWrapper.className = 'lightbox-wrapper'

    // Create content container
    const contentContainer = document.createElement('div')
    contentContainer.id = 'lightbox-content'
    contentContainer.className = 'lightbox-content'

    // Create loading text initially
    const loadingText = document.createElement('div')
    loadingText.id = 'lightbox-loading'
    loadingText.className = 'lightbox-loading'
    loadingText.textContent = 'Loading...'
    contentContainer.appendChild(loadingText)

    // Create close button
    const closeButton = document.createElement('button')
    closeButton.className = 'lightbox-close-button'
    closeButton.textContent = '×'

    closeButton.onclick = function () {
      lightbox.classList.remove('active')
      setTimeout(() => {
        lightbox.style.pointerEvents = 'none'
      }, 300) // Match transition duration
    }

    // Create external link button
    const externalLinkButton = document.createElement('a')
    externalLinkButton.id = 'lightbox-external-link'
    externalLinkButton.className = 'lightbox-external-link'
    externalLinkButton.textContent = 'View Original Image'
    externalLinkButton.style.display = 'none' // Initially hidden until image loads
    externalLinkButton.setAttribute('target', '_blank')
    externalLinkButton.setAttribute('rel', 'noopener noreferrer')

    contentContainer.appendChild(closeButton)
    contentWrapper.appendChild(contentContainer)
    contentWrapper.appendChild(externalLinkButton)
    lightbox.appendChild(contentWrapper)
    document.body.appendChild(lightbox)
  }

  // Reset lightbox content
  const contentWrapper = document.getElementById('lightbox-wrapper')
  const contentContainer = document.getElementById('lightbox-content')
  const loadingText =
    document.getElementById('lightbox-loading') ||
    contentContainer.querySelector('.lightbox-loading')
  const externalLinkButton = document.getElementById('lightbox-external-link')

  // Update external link
  if (externalLinkButton) {
    externalLinkButton.href = externalUrl
    externalLinkButton.style.display = 'none' // Hide until image loads
  }

  // Initially set content container to loading size
  contentContainer.style.width = '200px'
  contentContainer.style.height = 'auto'

  // Remove any existing image
  const existingImg = contentContainer.querySelector('.lightbox-image')
  if (existingImg) {
    contentContainer.removeChild(existingImg)
  }

  // Show loading text if it doesn't exist
  if (!loadingText) {
    const newLoadingText = document.createElement('div')
    newLoadingText.id = 'lightbox-loading'
    newLoadingText.className = 'lightbox-loading'
    newLoadingText.textContent = 'Loading...'
    contentContainer.appendChild(newLoadingText)
  } else {
    loadingText.style.display = 'block'
  }

  // Make lightbox visible
  lightbox.classList.add('active')
  lightbox.style.pointerEvents = 'auto'

  // Preload image
  const img = new Image()
  img.onload = function () {
    // Remove loading text
    const loadingElement = document.getElementById('lightbox-loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }

    // Calculate proper dimensions for the container
    const viewportWidth = window.innerWidth * 0.9 // 90% of viewport width
    const viewportHeight = window.innerHeight * 0.9 // 90% of viewport height

    // Determine image aspect ratio
    const imageRatio = img.naturalWidth / img.naturalHeight

    // Calculate dimensions to fit within viewport while maintaining aspect ratio
    let containerWidth, containerHeight

    if (
      img.naturalWidth > viewportWidth ||
      img.naturalHeight > viewportHeight
    ) {
      // Image is larger than viewport constraints
      const viewportRatio = viewportWidth / viewportHeight

      if (imageRatio > viewportRatio) {
        // Image is wider relative to viewport
        containerWidth = viewportWidth
        containerHeight = containerWidth / imageRatio
      } else {
        // Image is taller relative to viewport
        containerHeight = viewportHeight
        containerWidth = containerHeight * imageRatio
      }
    } else {
      // Image is smaller than viewport constraints, use actual size
      containerWidth = img.naturalWidth
      containerHeight = img.naturalHeight
    }

    // Set container dimensions with a small padding
    contentContainer.style.width = containerWidth + 'px'
    contentContainer.style.height = containerHeight + 'px'

    // Set image class
    img.className = 'lightbox-image'

    // Add image to content container
    contentContainer.appendChild(img)

    // Show external link button
    if (externalLinkButton) {
      externalLinkButton.style.display = 'inline-block'
    }
  }

  img.onerror = function () {
    const loadingElement = document.getElementById('lightbox-loading')
    if (loadingElement) {
      loadingElement.textContent = 'Error loading image'
    }
  }

  // Set image source to start loading
  img.src = imageUrl
}
