import * as vscode from 'vscode'

export const selectScript = async (): Promise<string | null> => {
    const uris = await vscode.workspace.findFiles('**/*.art')
    if (!uris || uris.length === 0) {
        vscode.window.showInformationMessage('No Arturo file found in workspace.')
        return null
    }

    const items = uris.map(u => ({
        label: vscode.workspace.asRelativePath(u),
        uri: u
    })) as Array<vscode.QuickPickItem & { uri: vscode.Uri }>;

    const pick = await vscode.window.showQuickPick(items, { 
        placeHolder: 'Select a file to run with Arturo' 
    })

    if (!pick) {
        return null
    } else {
        return (pick as any).uri.fsPath as string
    }
}

export const ask = async (prompt: string): Promise<string | null> => {
    const input = await vscode.window.showInputBox({
        prompt
    })
    return (input === undefined) ? null : input
}