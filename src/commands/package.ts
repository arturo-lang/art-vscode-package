/** 
 * @module commands/package
 * @fileoverview Arturo Package Manager related commands.
 */


import * as vscode from 'vscode'

import { arturo } from './helper/arturo'
import { ensure } from './helper/error'
import { openPage } from './helper/ui'
import { installed, registered, selectPackage } from './helper/packages'

type PackageAction = 'install' | 'uninstall' | 'update' | 'docs'

interface ActionQuickPickItem extends vscode.QuickPickItem {
    value: PackageAction
}

const pickAction = async (): Promise<ActionQuickPickItem> => {
    const action = await vscode.window.showQuickPick<ActionQuickPickItem>([
        { label: 'Install package', description: 'Fetch from registry', value: 'install' },
        { label: 'Uninstall package', description: 'Remove from local environment', value: 'uninstall' },
        { label: 'Update packages', description: 'Upgrade all installed packages', value: 'update' },
        { label: 'Open package docs', description: 'View documentation for a package', value: 'docs' },
    ], {
        placeHolder: 'What would you like to do with Arturo packages?'
    })

    return ensure({
        that: action,
        reason: 'Package action selection is required.'
    })
}

const installPackage = async () => {
    const message = 'Select a package to install'
    const name: string = ensure({
        that: await selectPackage(await registered(), message),
        reason: 'Package selection is required to install a package.'
    })

    arturo('Package Manager', `--package install ${name}`)
}

const uninstallPackage = async () => {
    const message = 'Select a package to uninstall'
    const name: string = ensure({
        that: await selectPackage(await installed(), message),
        reason: 'Package selection is required to uninstall a package.'
    })

    arturo('Package Manager', `--package uninstall ${name}`)
}

const updatePackages = async () => {
    arturo('Package Manager', '--package update')
}

const openPackageDocs = async () => {
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

/** Guides the user through package management actions. */
export const managePackages = async () => {
    const { value } = await pickAction()

    const options: Record<PackageAction, () => Promise<void>> = {
        install: installPackage,
        uninstall: uninstallPackage,
        update: updatePackages,
        docs: openPackageDocs
    }

    await options[value]()
}
