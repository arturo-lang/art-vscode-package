/** 
 * @module commands/package
 * @fileoverview Arturo Package Manager related commands.
 */

import { ask } from './helper/ui'
import { arturo } from './helper/arturo'
import { ensure } from './helper/error'

/** Asks the user for a package name to install. */
export const install = async () => {
    const name: string = ensure({
        that: await ask('Enter the name of the package to install:'),
        reason: 'Package name is required to install a package.',
    })

    arturo("Package Manager", `--package install ${name}`)
}

/** Asks the user for a package name to uninstall. */
export const uninstall = async () => {
    const name: string = ensure({
        that: await ask('Enter the name of the package to uninstall:'),
        reason: 'Package name is required to uninstall a package.',
    })

    arturo("Package Manager", `--package uninstall ${name}`)
}

/** Lists all installed packages. */
export const installed = async () => {
    arturo("Package Manager", `--package list`)
}

/** Lists all registered remote packages. */
export const registered = async () => {
    arturo("Package Manager", `--package remote`)
}

/** Updates all installed packages to their latest versions. */
export const updateAll = async () => {
    arturo("Package Manager", `--package update`)
}
