/** 
 * @module commands/package
 * @fileoverview Arturo Package Manager related commands.
 */

import * as vscode from 'vscode'

import { arturo } from './helper/arturo'
import { ensure } from './helper/error'
import { execSync } from 'child_process'
import { openPage } from './helper/ui'

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
const installed = async () =>
    parsePackageList(execSync('arturo --package list', { encoding: 'utf-8' }))

/** Lists all registered remote packages. */
const registered = async () => 
        parsePackageList(execSync('arturo --package remote', { encoding: 'utf-8' }))

const selectPackage = async (
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


export const openPackageDocs = async () => {
    const message = 'Select a package to view documentation'
    const name: string = ensure({
        that: await selectPackage(await registered(), message),
        reason: 'Package selection is required to view documentation.'
    })

    openPage({
        url: `https://${name}.pkgr.art`,
        title: `Package: ${name} Documentation`
    })
}


/** Asks the user for a package name to install. */
export const install = async () => {
    const message = 'Select a package to install'
    const name: string = ensure({
        that: await selectPackage(await registered(), message),
        reason: 'Package selection is required to install a package.'
    })

    arturo('Package Manager', `--package install ${name}`)
}

/** Asks the user for a package name to uninstall. */
export const uninstall = async () => {
    const message = 'Select a package to uninstall'
    const name: string = ensure({
        that: await selectPackage(await installed(), message),
        reason: 'Package selection is required to uninstall a package.'
    })

    arturo('Package Manager', `--package uninstall ${name}`)
}

/** Updates all installed packages to their latest versions. */
export const updateAll = async () => {
    arturo("Package Manager", `--package update`)
}
