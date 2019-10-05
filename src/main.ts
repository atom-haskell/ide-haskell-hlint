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
      onDidSaveBuffer: (buf) =>
        checkFile(
          buf,
          atom.config.get('ide-haskell-hlint').checkAllFilesInProject
            ? 'dir'
            : 'file',
        ) as any,
      onDidStopChanging: (buf) => {
        if (atom.config.get('ide-haskell-hlint').checkOnChange)
          return checkFile(buf, 'stdin') as any
      },
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
  mode: 'dir' | 'file' | 'stdin',
): Promise<undefined | UPI.IResultItem[]> {
  const bufpath = buf.getPath()
  if (!bufpath) return
  const rootpath = atom.project
    .getDirectories()
    .find((d) => d.contains(bufpath))
  const cwd = rootpath ? rootpath.getPath() : Path.dirname(bufpath)
  let path: string
  if (mode === 'dir') path = cwd
  else if (mode === 'file') path = bufpath
  else if (mode === 'stdin') path = '-'
  else throw new Error(`Unknown mode ${mode}`)
  try {
    const res = await new Promise<HLintResult>((resolve, reject) => {
      const cp = CP.execFile(
        atom.config.get('ide-haskell-hlint').hlintPath,
        ['--json', '--cross', '--no-exit-code', '--', path],
        {
          encoding: 'utf-8',
          cwd,
          maxBuffer: Infinity,
        },
        (error, result) => {
          if (error) reject(error)
          else {
            try {
              resolve(JSON.parse(result as string))
            } catch (e) {
              reject(e)
            }
          }
        },
      )
      if (mode === 'stdin') {
        cp.stdin.write(buf.getText())
        cp.stdin.end()
      }
    })
    return Promise.all(
      res.map(async (hr) => ({
        uri: Path.normalize(hr.file === '-' ? bufpath : hr.file),
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
    if (mode === 'dir') {
      try {
        return await checkFile(buf, 'file')
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
