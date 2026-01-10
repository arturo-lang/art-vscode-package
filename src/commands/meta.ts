/** 
 * @module commands/meta
 * @fileoverview Arturo Meta related commands.
 * 
 * Meta refers to commands that provide information about the Arturo
 * environment, documentation, or facilitate user feedback.
 * 
 */

import * as vscode from 'vscode'

import { arturoVersion } from './helper/arturo'
import { osInfo } from './helper/system'

/** Opens the Arturo GitHub issues page to report a new issue.
 * 
 * Pre-fills the issue title and body with system information to help
 * with debugging.
 */
export const reportIssue = async () => {
    const base = 'https://github.com/arturo-lang/arturo/issues/new'

    const title = await vscode.window.showInputBox({
        prompt: 'Issue title',
        placeHolder: 'Short, descriptive title for the issue'
    })
    if (title === undefined) return

    const vscodeVersion = (vscode as any).version || 'unknown'
    const appName = vscode.env.appName || 'unknown'

    const ext = vscode.extensions.getExtension('drkameleon.arturo')
    const extensionVersion = ext?.packageJSON?.version || 'unknown'

    let arturo: string | null = arturoVersion()
    if (arturo === null) {
        const reason = 'Arturo command line tool not found.'
        const recommendation = 'Please ensure Arturo is installed and added to your PATH.'
        vscode.window.showErrorMessage(`${reason} ${recommendation}`)
        return
    }

    const extensionContext = `
Issue reported from official Arturo's VS Code extension.
- VS Code: ${appName} ${vscodeVersion} / Extension: v${extensionVersion}
`

    const formsQuery = "?template=bug-report.yaml"
    const titleQuery = `title=${encodeURIComponent(title)}`
    const osQuery = `os=${encodeURIComponent(osInfo())}`
    const versionQuery = `version=${encodeURIComponent(arturo)}`
    const contextQuery = `additional-context=${encodeURIComponent(extensionContext)}`

    const query = [
        formsQuery,
        titleQuery,
        osQuery,
        versionQuery,
        contextQuery
    ].join("&")

    const url = `${base}${query}`

    vscode.env.openExternal(vscode.Uri.parse(url, ))
}

/** Opens the Arturo documentation in a webview panel.
 * 
 * If the webview cannot be created, it falls back to opening
 * the documentation in the default web browser.
 */
export const openDocs = () => {
    const url = 'https://arturo-lang.io/latest/documentation/library'

    try {
        const panel = vscode.window.createWebviewPanel(
            'arturoDocs',
            'Arturo Documentation',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        )

        panel.webview.html = `<!doctype html>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src https:; style-src 'unsafe-inline';">
            <style>html,body,iframe{height:100%;width:100%;margin:0;padding:0;border:0}</style>
            <iframe src="${url}" frameBorder="0" style="width:100%;height:100%;"></iframe>`
    } catch (e) {
        vscode.env.openExternal(vscode.Uri.parse(url))
    }
}