export const sceneFlow = {
  initial: 'index',
  preload: {
    index: ['guide'],
    guide: ['guide2'],
    guide2: ['guide3'],
    guide3: ['play'],
    play: ['playSecond'],
  },
}
