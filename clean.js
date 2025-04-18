const MenuId = '247'
const LogoId = '71'
const MenuBtnId = '249'
const MenuSoundBtnId = '289'
// # Elements are added to the DOM dinamically, so we need to wait for them to be available
const ElementIdsToRemove = [MenuId, LogoId]

function isMobile() {
  if (/Mobile\/\w+/.test(navigator.userAgent)) {
    return true
  }
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// add fixed cover for laoading screen
const loadingScreen = document.createElement('div')
loadingScreen.id = 'loading-screen'
loadingScreen.style.position = 'fixed'
loadingScreen.style.top = '0'
loadingScreen.style.left = '0'
loadingScreen.style.bottom = '0'
loadingScreen.style.right = '0'
loadingScreen.style.backgroundColor = '#4100FCff'
loadingScreen.style.transition =
  'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
loadingScreen.style.transitionDelay = '1s'
loadingScreen.style.zIndex = '9999'
loadingScreen.style.pointerEvents = 'none'

document.body.appendChild(loadingScreen)

// # add loading Text
const loadingText = document.createElement('div')
loadingText.id = 'loading-text'
loadingText.innerText = 'Loading...'
loadingText.style.position = 'absolute'
loadingText.style.top = '50%'
loadingText.style.left = '50%'
loadingText.style.transform = 'translate(-50%, -50%)'
loadingText.style.color = '#fff'
loadingText.style.fontSize = '16px'
loadingText.style.opacity = 1
loadingText.classList = 'inter-500'
loadingText.style.pointerEvents = 'none'
loadingText.style.transition = 'opacity .5s cubic-bezier(0.4, 0, 0.2, 1)'

loadingScreen.appendChild(loadingText)

function removeLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    console.log('[3dvista:clean] removing loading screen')
    loadingScreen.style.backgroundColor = '#4100FC00'

    loadingText.style.transitionDelay = '.6s'
    loadingText.style.opacity = 0
  } else {
    console.log('[3dvista:clean] loading screen not found')
  }
}

function addButtonBackground() {
  const menuBtn = document.getElementById(MenuBtnId)
  menuBtn.style.backgroundColor = '#4100FC'
  menuBtn.style.borderRadius = '100px'
}

function removeElements(idsToRemove) {
  const elementsToRemove = idsToRemove
    .map((id) => document.getElementById(id))
    .filter((element) => element !== null)
  if (elementsToRemove.length === 0) {
    console.log('[3dvista:clean] No elements to remove.')
    return
  }
  elementsToRemove.forEach((element) => {
    console.log(`[3dvista:clean] removing element with id ${element.id}`)
    element.remove()
  })
}

let removeElementsInterval = null
document.addEventListener('DOMContentLoaded', () => {
  console.log('[3dvista:clean] clean.js loaded.')
  if (!isMobile()) {
    console.log('[3dvista:clean] desktop detected, nothing to remove')
    removeLoadingScreen()
    addButtonBackground
    return
  }
  removeElementsInterval = setInterval(() => {
    const firstElementAvailable = document.getElementById(ElementIdsToRemove[0])
    if (firstElementAvailable) {
      console.log('[3dvista:clean] element available, let"s remove it')

      removeElements(ElementIdsToRemove)
      addButtonBackground()
      removeLoadingScreen()
      clearInterval(removeElementsInterval)
      return
    }
    console.log('[3dvista:clean] element not available yet, waiting...')
  }, 50)
})
