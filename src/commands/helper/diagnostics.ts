import * as vscode from 'vscode'
import * as path from 'path'
import { spawn } from 'child_process'


type ParsedRuntimeError = {
    file: string
    line: number
    message: string
}

const diagnostics = vscode.languages.createDiagnosticCollection('arturo')
const outputChannel = vscode.window.createOutputChannel('Arturo Runtime')

const parseRuntimeError = (raw: string): ParsedRuntimeError | null => {
    const normalized = raw.replace(/\r\n/g, '\n')
    const fileMatch = normalized.match(/File:\s*(.+)/)
    const lineMatch = normalized.match(/Line:\s*(\d+)/)
    if (!fileMatch || !lineMatch) return null

    const headerMatch = normalized.match(/══╡\s*(.+?)\s*╞/)
    const lines = normalized.split('\n')
    const headerIndex = lines.findIndex(l => l.includes('══╡'))
    const bodyLine = lines
        .slice(headerIndex + 1)
        .map(l => l.trim())
        .find(l => l.length > 0 && !l.startsWith('┃'))

    const headline = headerMatch?.[1]?.trim()
    const coreMessage = bodyLine || 'Runtime error'
    const message = headline ? `${headline}: ${coreMessage}` : coreMessage

    const file = fileMatch[1].trim()
    const line = Math.max(0, parseInt(lineMatch[1], 10) - 1)

    return { file, line, message }
}

const publishDiagnostic = (parsed: ParsedRuntimeError) => {
    const uri = vscode.Uri.file(parsed.file)
    const range = new vscode.Range(
        new vscode.Position(parsed.line, 0),
        new vscode.Position(parsed.line, 0)
    )

    const diagnostic = new vscode.Diagnostic(range, parsed.message, vscode.DiagnosticSeverity.Error)
    diagnostic.source = 'arturo'

    diagnostics.set(uri, [diagnostic])
}

export const runWithDiagnostics = async (file: string) => {
    diagnostics.delete(vscode.Uri.file(file))

    outputChannel.clear()
    outputChannel.show(true)
    outputChannel.appendLine(`$ arturo "${path.basename(file)}"`)

    return new Promise<void>((resolve) => {
        const proc = spawn('arturo', [file], { cwd: path.dirname(file) })

        let stderr = ''

        proc.stdout.on('data', data => {
            outputChannel.append(data.toString())
        })

        proc.stderr.on('data', data => {
            const text = data.toString()
            stderr += text
            outputChannel.append(text)
        })

        proc.on('error', err => {
            outputChannel.appendLine(`Arturo process failed: ${err.message}`)
            vscode.window.showErrorMessage('Arturo command not found or failed to start. Please ensure Arturo is installed and in PATH.')
            resolve()
        })

        proc.on('close', code => {
            if (code === 0) {
                diagnostics.delete(vscode.Uri.file(file))
                resolve()
                return
            }

            if (stderr.length === 0) {
                vscode.window.showErrorMessage('Arturo finished with errors.')
                resolve()
                return
            }

            const parsed = parseRuntimeError(stderr)
            if (parsed) {
                publishDiagnostic(parsed)
                const detail = `${parsed.message} (${path.basename(parsed.file)}:${parsed.line + 1})`
                vscode.window.showErrorMessage(detail, 'Open file').then(choice => {
                    if (choice === 'Open file') {
                        vscode.workspace.openTextDocument(parsed.file).then(doc => {
                            vscode.window.showTextDocument(doc).then(editor => {
                                const pos = new vscode.Position(parsed.line, 0)
                                const sel = new vscode.Selection(pos, pos)
                                editor.selection = sel
                                editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter)
                            })
                        })
                    }
                })
            } else {
                vscode.window.showErrorMessage('Arturo reported an error. See the output for details.')
            }

            resolve()
        })
    })
}