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
import { GithubUrl } from './helper/github'
import { ensure } from './helper/error'
import { extensionVersion, osInfo, vscodeInfo } from './helper/system'

/** Opens the Arturo GitHub issues page to report a new issue.
 * 
 * Pre-fills the issue title and body with system information to help
 * with debugging.
 */
export const reportIssue = async () => {
    const template = 'bug-report.yaml'

    const title: string = ensure({
        that: await vscode.window.showInputBox({
            prompt: 'Issue title',
            placeHolder: 'e.g.: [Collections\\split] Function is not working as expected',
        }),
        reason: 'Issue title is required to report an issue.',
        as: 'warning'
    })

    const version: string = ensure({ 
        that: arturoVersion,
        reason: [
            'Arturo command line tool not found.',
            'Please ensure Arturo is installed and added to your PATH.', 
        ],
        as: 'error'
    })

    const context = [
        'Issue reported from official Arturo\'s VS Code extension.',
        `- VS Code: ${vscodeInfo()} / Extension: v${extensionVersion()}`
    ].join('\n')
    
    const url = new GithubUrl({ owner: 'arturo-lang', repo: 'arturo' })
        .withPath('issues/new')
        .withQuery({
            template,
            title,
            os: osInfo(),
            version: version ?? "unknown",
            'additional-context': context
        })

    vscode.env.openExternal(vscode.Uri.parse(url.toString()))
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