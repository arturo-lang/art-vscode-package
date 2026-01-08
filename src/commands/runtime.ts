import * as vscode from 'vscode'

import {selectScript} from './helper/ui'
import { arturo } from './helper/arturo'
import { runWithDiagnostics } from './helper/diagnostics'



export const openRepl = () => {
    arturo('REPL', '--repl')
}

export const runFile = async () => {
    const file = await selectScript()
    if (!file) return

    await runWithDiagnostics(file)
}

export const bundleFile = async () => {
    const file = await selectScript()
    if (!file) return

    const asName = await vscode.window.showInputBox({
        prompt: 'Enter the bundle name',
        placeHolder: 'output.exe'
    })

    if (asName) {
        arturo('Bundle', `--bundle --as:"${asName}" "${file}"`)
    } else {
        arturo('Bundle', `--bundle "${file}"`)
    }

}