import * as fs from 'fs'
import * as os from 'os'

import * as vscode from 'vscode'

/** Retrieves the Linux distribution name from /etc/os-release. */
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

export const osInfo = () => {
    const distro = getDistro()
    const osLine = `${os.type()} ${distro ? ' - ' + distro : ''}`
    return osLine
}

export const vscodeInfo = () => {
    const appName = vscode.env.appName || 'unknown'
    const vscodeVersion = (vscode as any).version || 'unknown'

    return `${appName} ${vscodeVersion}`
}

export const extensionVersion = () => {
    return vscode.extensions.getExtension('drkameleon.arturo')?.packageJSON?.version || 'unknown'
}