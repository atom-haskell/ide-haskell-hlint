import * as UPI from 'atom-haskell-upi'
import * as CP from 'child_process'
import * as Atom from 'atom'
import * as Path from 'path'

export { config } from './config'

export function activate(_state: never) {}

export function deactivate() {}

export function provideUPI(): UPI.IRegistrationOptions {
  return {
    name: 'ide-haskell-hlint',
    messageTypes: {
      lint: {
        autoScroll: true,
        uriFilter: true,
      },
    },
    events: {
      onDidSaveBuffer: (buf) => checkFile(buf, true) as any,
    },
  }
}

type HLintResult = ReadonlyArray<HLintResultItem>

interface HLintResultItem {
  module: string[]
  decl: string[]
  severity: 'Suggestion'
  hint: string
  file: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  from: string
  to?: string
  note: string[]
}

async function checkFile(
  buf: Atom.TextBuffer,
  all = false,
): Promise<undefined | UPI.IResultItem[]> {
  const bufpath = buf.getPath()
  if (!bufpath) return
  const rootpath = atom.project
    .getDirectories()
    .find((d) => d.contains(bufpath))
  const cwd = rootpath ? rootpath.getPath() : Path.dirname(bufpath)
  const path = all ? cwd : bufpath
  try {
    const res = await new Promise<HLintResult>((resolve, reject) => {
      CP.execFile(
        'hlint',
        ['--json', '--cross', '--', path],
        {
          encoding: 'utf-8',
          cwd,
          maxBuffer: Infinity,
        },
        (error, result) => {
          if (error && result === undefined) reject(error)
          else resolve(JSON.parse(result as string))
        },
      )
    })
    console.log(res)
    return res.map((hr) => ({
      uri: Path.normalize(hr.file),
      position: { row: hr.startLine - 1, column: hr.startColumn - 1 },
      message: {
        html:
          `<p>${hr.hint}</p><p>Found: ${hr.from}</p>` +
          (hr.to ? `<p>Why not: ${hr.to}</p>` : ''),
      },
      severity: 'lint',
      context: hr.note.join(' '),
    }))
  } catch (e) {
    atom.notifications.addError(e.toString(), {
      detail: e.message,
      dismissable: true,
    })
    return
  }
}
