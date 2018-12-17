export {}
declare module 'atom' {
  interface TextEditor {
    onDidTokenize(callback: () => void): Disposable
  }
  interface TextBuffer {
    getLanguageMode(): { readonly fullyTokenized: boolean }
  }
  interface TextEditorElement {
    setUpdatedSynchronously(val: boolean): void
  }
}
