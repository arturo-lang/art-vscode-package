/** 
 * @module commands/package
 * @fileoverview Arturo Package Manager related commands.
 */


import { arturo } from './helper/arturo'
import { ensure } from './helper/error'
import { openPage } from './helper/ui'
import { installed, registered, selectPackage } from './helper/packages'

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
