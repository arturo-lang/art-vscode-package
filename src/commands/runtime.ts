import * as vscode from 'vscode'

import {selectScript} from "./helper/ui"


export const openRepl = () => {
	const terminal = vscode.window.createTerminal({ name: 'Arturo REPL' })
	terminal.show(true)
	terminal.sendText('arturo')
};

export const runFile = async () => {
	const file = await selectScript()
    if (!file) return

	const terminal = vscode.window.createTerminal({ name: 'Arturo Run' })
	terminal.show(true)
	terminal.sendText(`arturo "${file}"`)
}