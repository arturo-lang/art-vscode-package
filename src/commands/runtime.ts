

import * as vscode from 'vscode';

export const openRepl = () => {
	const terminal = vscode.window.createTerminal({ name: 'Arturo REPL' })
	terminal.show(true)
	terminal.sendText('arturo')
};

export const runFile = async () => {
	const uris = await vscode.workspace.findFiles('**/*.art')
	if (!uris || uris.length === 0) {
		vscode.window.showInformationMessage('No Arturo file found in workspace.')
		return
	}

	const items = uris.map(u => ({
		label: vscode.workspace.asRelativePath(u),
		uri: u
	})) as Array<vscode.QuickPickItem & { uri: vscode.Uri }>;

	const pick = await vscode.window.showQuickPick(items, { 
        placeHolder: 'Select a file to run with Arturo' 
    })

	if (!pick) return

	const file = (pick as any).uri.fsPath as string
	const terminal = vscode.window.createTerminal({ name: 'Arturo Run' })
	terminal.show(true)
	terminal.sendText(`arturo "${file}"`)
}