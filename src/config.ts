export const config = {
  checkAllFilesInProject: {
    type: 'boolean',
    default: false,
    description:
      'Try to check all *.hs files in current Atom project. ' +
      'Use with care, this may cause intermittent freezes on large code bases. ' +
      'When disabled, only runs hlint on the last saved file.',
  },
  checkOnChange: {
    type: 'boolean',
    default: false,
    description:
      'Re-check current file on each change. ' +
      'Can be extremely distracting.',
  },
}

// generated by typed-config.js
declare module 'atom' {
  interface ConfigValues {
    'ide-haskell-hlint.checkAllFilesInProject': boolean
    'ide-haskell-hlint.checkOnChange': boolean
    'ide-haskell-hlint': {
      checkAllFilesInProject: boolean
      checkOnChange: boolean
    }
  }
}
