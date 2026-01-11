import * as vscode from "vscode"

import { execSync } from "child_process"
import { ensure } from "./error"

/**
 * Parse the tabular output of arturo and return only package names.
 */
const parsePackageList = (raw: string): string[] => {
    const entry = /^\s*[-*]\s+([^\s]+)\s+/

    return raw
        .split(/\r?\n/)
        .filter(line => line.startsWith('- ') || line.startsWith('* '))
        .map(line => entry.exec(line))
        .filter((match): match is RegExpExecArray => !!match)
        .map(match => match[1].trim())
}

/** Lists all installed packages. */
export const installed = async () =>
    parsePackageList(execSync('arturo --package list', { encoding: 'utf-8' }))

/** Lists all registered remote packages. */
export const registered = async () => 
        parsePackageList(execSync('arturo --package remote', { encoding: 'utf-8' }))

export const selectPackage = async (
    packages: string[],
    placeholder: string,
): Promise<string | null> => {
    ensure({
        that: packages.length > 0,
        reason: 'No packages available for selection.'
    })

    const selection = await vscode.window.showQuickPick(packages, {
        placeHolder: placeholder
    })

    return selection ?? null
}