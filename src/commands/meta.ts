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