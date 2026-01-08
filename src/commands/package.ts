import * as vscode from 'vscode'
import { ask } from './helper/ui'
import { arturo } from './helper/arturo'

export const install = async () => {
    const packageName = await ask('Enter the name of the package to install:')
    if (!packageName) return

    arturo("Package Manager", `--package install ${packageName}`)
}

export const uninstall = async () => {
    const packageName = await ask('Enter the name of the package to uninstall:')
    if (!packageName) return

    arturo("Package Manager", `--package uninstall ${packageName}`)
}

export const installed = async () => {
    arturo("Package Manager", `--package list`)
}

export const registered = async () => {
    arturo("Package Manager", `--package remote`)
}

export const updateAll = async () => {
    arturo("Package Manager", `--package update`)
}
