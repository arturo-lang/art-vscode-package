import * as vscode from 'vscode'

import {selectScript} from "./helper/ui"
import { arturo } from './helper/arturo';


export const openRepl = () => {
	arturo('REPL', '--repl')
};

export const runFile = async () => {
	const file = await selectScript()
    if (!file) return

	arturo('Run', `"${file}"`)
}

export const runCurrentFile = async () => {
    const editor = vscode.window.activeTextEditor

    if (!editor) {
        vscode.window.showWarningMessage('No active editor to run.')
        return
    }

    const doc = editor.document
    if (doc.languageId !== 'art' && !doc.fileName.toLowerCase().endsWith('.art')) {
        vscode.window.showWarningMessage('Open an Arturo file to run it.')
        return
    }

    if (doc.isUntitled) {
        vscode.window.showWarningMessage('Save the Arturo file before running it.')
        return
    }

    if (doc.isDirty) await doc.save()

    arturo('Run', `"${doc.fileName}"`)
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