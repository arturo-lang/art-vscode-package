import { command, Context } from "./helper"

import { bundleFile, openRepl, runCurrentFile, runFile } from "./commands/runtime"
import { openDocs, reportIssue } from "./commands/meta"
import { install, installed, registered, uninstall, updateAll } from "./commands/package"

export const activate = (context: Context) => {

    command(context, "arturo.runtime.repl", openRepl)
    command(context, "arturo.runtime.run", runFile)
    command(context, "arturo.runtime.run-current", runCurrentFile)
    command(context, "arturo.runtime.bundle", bundleFile)

    command(context, "arturo.package.install", install)
    command(context, "arturo.package.uninstall", uninstall)
    command(context, "arturo.package.list", installed)
    command(context, "arturo.package.remote", registered)
    command(context, "arturo.package.update", updateAll)

    command(context, "arturo.meta.report-issue", reportIssue)
    command(context, "arturo.meta.open-docs", openDocs)
    
}

export const deactivate = () => {}
