/** 
 * @module commands/package
 * @fileoverview Arturo Package Manager related commands.
 */

import { ask } from './helper/ui'
import { arturo } from './helper/arturo'

/** Asks the user for a package name to install. */
export const install = async () => {
    const packageName = await ask('Enter the name of the package to install:')
    if (!packageName) return

    arturo("Package Manager", `--package install ${packageName}`)
}

/** Asks the user for a package name to uninstall. */
export const uninstall = async () => {
    const packageName = await ask('Enter the name of the package to uninstall:')
    if (!packageName) return

    arturo("Package Manager", `--package uninstall ${packageName}`)
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
