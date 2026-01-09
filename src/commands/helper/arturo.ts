import * as vscode from 'vscode'

import { execSync } from 'child_process'

export const arturo = (context: string, command: string) => {
    const terminal = vscode.window.createTerminal({ name: `Arturo ${context}` })
    terminal.show(true)
    terminal.sendText(`arturo ${command}`)
}

export const arturoVersion = (): string | null => {
    try {
        return execSync('arturo --version', { 
            encoding: 'utf8', 
            stdio: ['ignore', 'pipe', 'ignore'] 
        }).trim()
    } catch {
        return null
    }
}