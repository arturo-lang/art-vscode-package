import * as vscode from "vscode"

import { withNotify } from "./commands/helper/error"

/** Type alias for VS Code ExtensionContext for easier usage. */
export type Context = vscode.ExtensionContext


/** Register a command and push its Disposable into ctx.subscriptions. 
 * 
 * This function simplifies command registration by combining the registration
 * and subscription steps into one.
 * 
 * @param ctx - The extension context.
 * @param id - The command identifier.
 * @param action - The function to execute when the command is invoked.
*/
export const command = (ctx: Context, id: string, action: () => void) => {
    const disposable = vscode.commands.registerCommand(id, withNotify(action))
    ctx.subscriptions.push(disposable)
}
