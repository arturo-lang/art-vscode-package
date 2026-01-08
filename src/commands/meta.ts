import * as vscode from 'vscode'
import * as os from 'os'
import * as fs from 'fs'
import { execSync } from 'child_process'


const getDistro = () => {
    try {
        if (process.platform === 'linux') {
            const data = fs.readFileSync('/etc/os-release', 'utf8')
            const m = data.match(/^PRETTY_NAME=(?:"|')?(.+?)(?:"|')?$/m)
            if (m) return m[1]
        }
    } catch (e) {}
    return ''
}

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

    const distro = getDistro()
    const osLine = `${os.type()} ${distro ? ' - ' + distro : ''}`

    let arturoVersion = 'not found'
    try {
        arturoVersion = execSync('arturo --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    } catch (e) {
        const reason = 'Arturo command line tool not found.'
        const recommendation = 'Please ensure Arturo is installed and added to your PATH.'
        vscode.window.showErrorMessage(`${reason} ${recommendation}`)
        return
    }

    const body = [
        '**Bug Description**',
        "...",
        '',
        '**Steps to Reproduce**',
        '...',
        '',
        '**Expected behavior**',
        '...',
        '',
        '**System**',
        `- OS: ${osLine}`,
        `- Arturo: ${arturoVersion}`,
        `- VS Code: ${appName} ${vscodeVersion} / Extension: v${extensionVersion}`,
        ``,
        '**More Information**',
        '  - Issue reported from VS Code extension',
        '  - ...'
    ].join('\n')

    const url = `${base}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    vscode.env.openExternal(vscode.Uri.parse(url, ))
}

export const openDocs = () => {
    const url = 'https://arturo-lang.io/master/documentation'

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