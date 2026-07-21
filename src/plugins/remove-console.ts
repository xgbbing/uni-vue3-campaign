import type { Plugin } from 'vite'
export function removeConsole(): Plugin {
  return {
    name: 'remove-console',
    transform(code: string) {
      return {
        code: code.replace(/console\.log\(.*?\);?/g, ''),
        map: null,
      }
    },
  }
}
