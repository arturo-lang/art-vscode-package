import * as vscode from "vscode"

export type Context = vscode.ExtensionContext

export const command = (ctx: Context, id: string, action: () => void) => {
    const disposable = vscode.commands.registerCommand(id, action)
    ctx.subscriptions.push(disposable)
}
