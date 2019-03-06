import * as UPI from 'atom-haskell-upi'
import * as CP from 'child_process'
import * as Atom from 'atom'
import * as Path from 'path'
import { highlightCode } from './highlight'

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
  severity: string
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
          else {
            try {
              resolve(JSON.parse(result as string))
            } catch (e) {
              reject(error)
            }
          }
        },
      )
    })
    return Promise.all(
      res.map(async (hr) => ({
        uri: Path.normalize(hr.file),
        position: { row: hr.startLine - 1, column: hr.startColumn - 1 },
        message: {
          html:
            `<p>${hr.hint}</p><p>Found:<pre>${await highlightCode(
              hr.from,
              'source.haskell',
            )}</pre></p>` +
            (hr.to
              ? `<p>Why not:<pre>${await highlightCode(
                  hr.to,
                  'source.haskell',
                )}</pre></p>`
              : '') +
            (hr.note.length ? `<p>Note: ${hr.note.join('<br>')}</p>` : ''),
        },
        severity: 'lint',
        context: hr.severity,
      })),
    )
  } catch (e) {
    console.warn(e)
    if (all) {
      try {
        return await checkFile(buf, false)
      } catch (e) {
        console.warn(e)
        atom.notifications.addError(e.toString(), {
          detail: e.message,
          dismissable: true,
        })
      }
    } else {
      atom.notifications.addError(e.toString(), {
        detail: e.message,
        dismissable: true,
      })
    }
    return
  }
}
