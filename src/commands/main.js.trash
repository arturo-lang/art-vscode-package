import * as vscode from 'vscode'
import * as runtime from './runtime.js'
import * as package from './package.js'
import * as meta from './meta.js'

const command = (ctx, id, action) => {
    const disposable = vscode.commands.registerCommand(id, action)
    ctx.subscriptions.push(disposable)
}

export const activate = (ctx) => {

    const command = (id, action) => command(ctx, id, action)

	command('arturo.runtime.repl', runtime.openRepl)
    command("arturo.runtime.run", runtime.runFile)
    command("arturo.runtime.bundle", runtime.bundleFile)

    command("arturo.package.install", package.install)
    command("arturo.package.uninstall", package.uninstall)
    command("arturo.package.remote", package.listRemote)
    command("arturo.package.list", package.listInstalled)
    command("arturo.package.update", package.updateInstalled)
    command("arturo.package.docs", package.openDocs)

    command("arturo.meta.report", meta.reportIssue)
    command("arturo.meta.docs", meta.openDocs)

}

export const deactivate = () => {

}