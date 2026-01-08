import * as vscode from 'vscode'

export const arturo = (context: string, command: string) => {
    const terminal = vscode.window.createTerminal({ name: `Arturo ${context}` })
    terminal.show(true)
    terminal.sendText(`arturo ${command}`)
}