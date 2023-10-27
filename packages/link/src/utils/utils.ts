import { LinkStyle } from './types'

export function getLinkStyle(url: string): LinkStyle | undefined {
  try {
    const params = new URLSearchParams(url)
    const style = params.get('link_style')
    return style && JSON.parse(window.atob(style))
  } catch (e) {
    return undefined
  }
}

export function getNumber(def: number, value?: number): number {
  return value && value >= 0 ? value : def
}
