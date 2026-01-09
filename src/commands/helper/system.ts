import * as fs from 'fs'
import * as os from 'os'

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