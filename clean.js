const MenuId = '137'
const LogoId = '261'
const MenuBtnId = '116'
const MenuSoundBtnId = '144'
// # Elements are added to the DOM dinamically, so we need to wait for them to be available
const ElementIdsToRemove = [MenuId, LogoId]

// to remove other menu element, as they're injected later in the page,
// it's better to remove them by class name using a CSS trick (as ccs classes cannot start with numbers...)
// check build.sh, at the end of the added style:
//#\31 44 {
//   display:none !important;
// }

// #\36 2 {
//     display:none !important;
// }
// #\32 66 {
//     display:none !important;
// }
// #\32 24{
//     display:none !important;
// }

function isMobile() {
  if (/Mobile\/\w+/.test(navigator.userAgent)) {
    return true
  }
  if (isIPad()) {
    return true
  }
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

function isIPad() {
  const ua = navigator.userAgent || navigator.vendor || window.opera

  // Classic iPad detection
  const iPadUA = /iPad/.test(ua)

  // Newer iPadOS 13+ detection: identifies as Mac but has touch support
  const iPadOS13Plus =
    ua.includes('Macintosh') &&
    'ontouchstart' in window &&
    navigator.maxTouchPoints > 1

  return iPadUA || iPadOS13Plus
}

console.info(
  '[3dvista:clean] \n - isMobile:',
  isMobile(),
  '\n - isIPad:',
  isIPad(),
  '\n userAgent',
  navigator.userAgent,
  window.innerWidth
)

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
  if (!menuBtn) {
    console.log('[3dvista:clean] menu button not found, check id', MenuBtnId)
    return
  }
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
  console.log(
    '[3dvista:clean] clean.js loaded!!!!!',
    'UserAgent:',
    navigator.userAgent
  )
  if (!isMobile()) {
    console.log('[3dvista:clean] desktop detected, nothing to remove')
    removeLoadingScreen()
    addButtonBackground()
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
