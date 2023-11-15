import { LinkStyle } from './types'
import { getLinkStyle, getNumber } from './style'
import { sdkSpecs } from "./sdk-specs";

const popupId = 'front-link-popup'
const backdropId = 'front-link-popup__backdrop'
const popupContentId = 'front-link-popup__popup-content'
const stylesId = 'front-link-popup__styles'
export const iframeId = 'front-link-popup__iframe'

const getPopupHtml = (link: string) => `
<div id="${popupId}">
  <div id="${backdropId}"></div>
  <div id="${popupContentId}">
    <iframe id="${iframeId}" src="${link}" allow="clipboard-read *; clipboard-write *" />
  </div>
</div>
`

const getStyles = (style?: LinkStyle) => `
<style id="${stylesId}">
  body {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }

  #${popupId} {
    all: unset;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  #${backdropId} {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10000;
    background: black;
    opacity: ${getNumber(0.6, style?.io)};
  }

  #${popupContentId} {
    position: absolute;
    height: 80%;
    max-height: 710px;
    min-height: 685px;
    margin: auto;
    z-index: 10001;
    width: 30%;
    max-width: 430px;
    min-width: 380px;
    display: flex;
    flex-direction: column;
    border-radius: ${getNumber(24, style?.ir)}px;
    background: white;
    flex-grow: 1;
  }

  #${popupContentId} iframe {
    border: none;
    width: 100%;
    flex-grow: 1;
    border-radius: ${getNumber(24, style?.ir)}px;
  }

  @media only screen and (max-width: 768px) {
    #${popupContentId} {
      height: 100vh;
      width: 100vw;
      max-width: 100%;
      min-width: 100%;
      max-height: 100%;
      min-height: 100%;
      border-radius: 0px;
    }

    #${popupContentId} iframe {
      border-radius: 0px;
    }
  }

  @media only screen and (max-height: 710px) {
    #${popupContentId} {
      max-height: 100%;
      min-height: 100%;
    }
  }
</style>
`

function addPlatformSpecs(): void {
  const windowObj = window as Record<string, any>;
  windowObj.meshSdkPlatform= sdkSpecs.platform;
  windowObj.meshSdkVersion= sdkSpecs.version;

  if (window.parent) {
    const parentWindowObj = window.parent as Record<string, any>;
    parentWindowObj.meshSdkPlatform= sdkSpecs.platform;
    parentWindowObj.meshSdkVersion= sdkSpecs.version;
  }
}

export function removePopup(): void {
  const existingPopup = window.document.getElementById(popupId)
  existingPopup?.parentElement?.removeChild(existingPopup)

  const existingStyles = window.document.getElementById(stylesId)
  existingStyles?.parentElement?.removeChild(existingStyles)
}

export function addPopup(iframeLink: string): void {
  addPlatformSpecs()
  const style = getLinkStyle(iframeLink)
  removePopup()
  const popup = getPopupHtml(iframeLink)
  const stylesElement = htmlToElement(getStyles(style))
  if (stylesElement) {
    window.document.head.appendChild(stylesElement)
  }

  const popupElement = htmlToElement(popup)
  if (popupElement) {
    window.document.body.appendChild(popupElement)
  }
}

function htmlToElement(html: string): Node | null {
  const template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}
