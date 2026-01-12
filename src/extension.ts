import { command, Context } from "./helper"

import { bundleFile, openRepl, runCurrentFile, runFile } from "./commands/runtime"
import { openDocs, reportIssue } from "./commands/meta"
import { managePackages } from "./commands/package"
import { registerNotebook } from "./notebook"


/** Register commands for the Arturo VS Code extension on activate.
 * 
 * @param context - The extension context provided by VS Code.
 */
export const activate = (context: Context) => {

    registerNotebook(context)

    command(context, "arturo.runtime.repl", openRepl)
    command(context, "arturo.runtime.run", runFile)
    command(context, "arturo.runtime.run-current", runCurrentFile)
    command(context, "arturo.runtime.bundle", bundleFile)

    command(context, "arturo.package.manage", managePackages)

    command(context, "arturo.meta.report-issue", reportIssue)
    command(context, "arturo.meta.open-docs", openDocs)
    
}

/** Deactivate the Arturo VS Code extension.
 * 
 *  Since there is no cleanup needed, this function is empty.
 */
export const deactivate = () => {}
