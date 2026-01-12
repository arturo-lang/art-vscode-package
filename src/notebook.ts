import * as vscode from 'vscode'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execFile } from 'child_process'

import { Context } from './helper'

type SketchCell = {
    cell_type?: string
    metadata?: Record<string, unknown>
    source?: string[] | string
}

type SketchFile = {
    cells?: SketchCell[]
    metadata?: Record<string, unknown>
    nbformat?: number
    nbformat_minor?: number
}

const toText = (content: Uint8Array): string => {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(content).toString('utf8')
    }
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder('utf-8').decode(content)
    }
    return ''
}

const fromText = (text: string): Uint8Array => {
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(text)
    }
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(text, 'utf8')
    }
    return new Uint8Array()
}

const asLines = (source: unknown): string => {
    if (Array.isArray(source)) return source.map(String).join('\n')
    if (typeof source === 'string') return source
    return ''
}

const normalizeLanguage = (lang: unknown, kind: vscode.NotebookCellKind): string => {
    if (kind === vscode.NotebookCellKind.Markup) return 'markdown'
    if (typeof lang === 'string' && lang.trim().length > 0) {
        const lower = lang.toLowerCase()
        if (lower.startsWith('art')) return 'art'
        return lang
    }
    return 'art'
}

const deserializeCells = (sketch: SketchFile): vscode.NotebookCellData[] => {
    const cells = Array.isArray(sketch.cells) ? sketch.cells : []

    return cells.map(cell => {
        const kind = cell.cell_type === 'markdown'
            ? vscode.NotebookCellKind.Markup
            : vscode.NotebookCellKind.Code

        const data = new vscode.NotebookCellData(
            kind,
            asLines(cell.source),
            normalizeLanguage(cell.metadata?.language, kind)
        )

        data.metadata = cell.metadata ?? {}
        data.outputs = []

        return data
    })
}

const serializeCells = (cells: readonly vscode.NotebookCellData[]) => cells.map(cell => {
    const isMarkup = cell.kind === vscode.NotebookCellKind.Markup
    const metadata = { ...cell.metadata, language: cell.languageId || (isMarkup ? 'markdown' : 'art') }

    return {
        cell_type: isMarkup ? 'markdown' : 'code',
        metadata,
        source: cell.value.split(/\r?\n/),
        outputs: [],
        execution_count: null
    }
})

const fallbackCell = (text: string) => {
    const value = text ? `Could not parse sketch; showing raw contents:\n\n${text}` : 'Empty sketch.'
    const cell = new vscode.NotebookCellData(
        vscode.NotebookCellKind.Markup,
        value,
        'markdown'
    )
    return cell
}

const runCell = async (cell: vscode.NotebookCell): Promise<void> => {
    if (cell.kind !== vscode.NotebookCellKind.Code) {
        return
    }

    const execution = controller.createNotebookCellExecution(cell)
    execution.start(Date.now())

    const notebook = cell.notebook
    const codeCells = notebook.getCells().filter(c => c.kind === vscode.NotebookCellKind.Code)
    const targetIndex = codeCells.findIndex(c => c === cell)
    const upTo = targetIndex === -1 ? codeCells : codeCells.slice(0, targetIndex + 1)
    const combined = upTo.map(c => c.document.getText()).join('\n\n')

    const tmpFile = path.join(os.tmpdir(), `arturo-cell-${Date.now()}-${Math.random().toString(16).slice(2)}.art`)

    try {
        await fs.promises.writeFile(tmpFile, combined, 'utf8')

        const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
            execFile('arturo', [tmpFile], { encoding: 'utf8' }, (err, out, errOut) => {
                if (err) {
                    reject({ err, stdout: out ?? '', stderr: errOut ?? '' })
                } else {
                    resolve({ stdout: out ?? '', stderr: errOut ?? '' })
                }
            })
        }).catch((result: any) => {
            if (result && typeof result === 'object' && 'stdout' in result) {
                return { stdout: (result.stdout as string) ?? '', stderr: (result.stderr as string) ?? String(result.err ?? '') }
            }
            return { stdout: '', stderr: String(result) }
        })

        const outputItems: vscode.NotebookCellOutputItem[] = []
        if (stdout && stdout.length > 0) {
            outputItems.push(vscode.NotebookCellOutputItem.stdout(stdout))
        }
        if (stderr && stderr.length > 0) {
            outputItems.push(vscode.NotebookCellOutputItem.stderr(stderr))
        }

        execution.replaceOutput(outputItems.length ? [new vscode.NotebookCellOutput(outputItems)] : [])
        execution.end(true, Date.now())
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        execution.replaceOutput([
            new vscode.NotebookCellOutput([
                vscode.NotebookCellOutputItem.stderr(message)
            ])
        ])
        execution.end(false, Date.now())
    } finally {
        fs.promises.unlink(tmpFile).catch(() => {})
    }
}

const controller = vscode.notebooks.createNotebookController(
    'arturo-sketch-controller',
    'arturo-sketch',
    'Arturo Sketch'
)

controller.supportsExecutionOrder = false
controller.description = 'Run Arturo sketch cells via arturo command'
controller.executeHandler = (cells) => {
    cells = Array.isArray(cells) ? cells : [cells]
    // Run sequentially so dependencies between cells are respected.
    cells.reduce(async (prev, cell) => {
        await prev
        return runCell(cell)
    }, Promise.resolve())
}

/** Register a minimal serializer and runner for .sketch Arturo notebooks. */
export const registerNotebook = (context: Context) => {
    const serializer: vscode.NotebookSerializer = {
        async deserializeNotebook(content) {
            const text = toText(content)
            const trimmed = text.trim()
            if (!trimmed) return new vscode.NotebookData([])

            try {
                const sketch = JSON.parse(trimmed) as SketchFile
                return new vscode.NotebookData(deserializeCells(sketch))
            } catch {
                return new vscode.NotebookData([fallbackCell(text)])
            }
        },
        async serializeNotebook(data) {
            const sketch: SketchFile = {
                cells: serializeCells(data.cells),
                nbformat: 4,
                nbformat_minor: 5,
                metadata: {}
            }

            const json = JSON.stringify(sketch, null, 2)
            return fromText(json)
        }
    }

    const disposable = vscode.workspace.registerNotebookSerializer(
        'arturo-sketch',
        serializer,
        { transientOutputs: true }
    )

    context.subscriptions.push(disposable, controller)
}
