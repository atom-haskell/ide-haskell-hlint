import { TextEditor } from 'atom'

export async function highlightCode(src: string, grammarName: string) {
  const ed = new TextEditor({
    readonly: true,
    keyboardInputEnabled: false,
    showInvisibles: false,
    tabLength: atom.config.get('editor.tabLength'),
  })
  const el = atom.views.getView(ed)
  try {
    el.setUpdatedSynchronously(true)
    el.style.pointerEvents = 'none'
    el.style.position = 'absolute'
    el.style.width = '0px'
    el.style.height = '1px'
    atom.views.getView(atom.workspace).appendChild(el)
    atom.grammars.assignLanguageMode(ed.getBuffer(), grammarName)
    ed.setText(src)
    await editorTokenized(ed)
    const html = Array.from(el.querySelectorAll('.line:not(.dummy)'))
    return html.map((el) => el.innerHTML).join('\n')
  } finally {
    el.remove()
  }
}

async function editorTokenized(editor: TextEditor) {
  return new Promise((resolve) => {
    if (editor.getBuffer().getLanguageMode().fullyTokenized) {
      resolve()
    } else {
      const disp = editor.onDidTokenize(() => {
        disp.dispose()
        resolve()
      })
    }
  })
}
