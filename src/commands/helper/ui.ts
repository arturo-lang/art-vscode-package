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

interface OpenDocsArgs {
    url: string,
    title: string
}

/** Opens some page in a webview panel.
 * 
 * If the webview cannot be created, it falls back to opening
 * the documentation in the default web browser.
 */
export const openPage = (args: OpenDocsArgs) => {
    try {
        const panel = vscode.window.createWebviewPanel(
            args.title.replace(/\s+/g, '-').toLowerCase(),
            args.title,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        )

        panel.webview.html = `<!doctype html>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src https:; style-src 'unsafe-inline';">
            <style>html,body,iframe{height:100%;width:100%;margin:0;padding:0;border:0}</style>
            <iframe src="${args.url}" frameBorder="0" style="width:100%;height:100%;"></iframe>`
    } catch (e) {
        vscode.env.openExternal(vscode.Uri.parse(args.url))
    }
}