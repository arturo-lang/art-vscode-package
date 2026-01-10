/** 
 * @module commands/runtime
 * @fileoverview Arturo Runtime related commands.
 */

import * as vscode from 'vscode'

import {selectScript} from './helper/ui'
import { arturo } from './helper/arturo'
import { runWithDiagnostics } from './helper/diagnostics'
import { ensure } from './helper/error'


/** Opens the Arturo REPL in a new terminal window. */
export const openRepl = () => {
    arturo('REPL', '--repl')
}

/** Prompts the user to select an Arturo script and runs it.
 * 
 * This runs with diagnostics enabled to capture and display any runtime errors.
 * If no file is selected, the function exits without action.
 * */
export const runFile = async () => {
    const file = await selectScript()
    if (!file) return

    await runWithDiagnostics(file)
}

/** Runs the currently active Arturo file in the editor.
 * 
 * This runs with diagnostics enabled to capture and display any runtime errors.
 * If no active editor or the file is not an Arturo file, it shows a warning.
 * If the file is unsaved or has unsaved changes, it prompts to save before running.
 */
export const runCurrentFile = async () => {

    const editor = ensure({
        that: vscode.window.activeTextEditor,
        reason: 'No active editor to run.',
    })

    ensure({
        that: editor.document.languageId == 'art',
        reason: 'Open an Arturo file to run it.',
    })

    ensure({
        that: !editor.document.isUntitled,
        reason: 'Save the Arturo file before running it.'
    })

    if (editor.document.isDirty) 
        await editor.document.save()

    runWithDiagnostics(editor.document.fileName)
}

/** Prompts the user to select an Arturo script and bundles it.
 * 
 * The user can specify the output bundle name. 
 * If no file is selected, the function exits without action.
 */
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