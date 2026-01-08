import { command, Context } from "./helper"

import { helloWorld } from "./commands/hello"
import { bundleFile, openRepl, runFile } from "./commands/runtime"
import { openDocs, reportIssue } from "./commands/meta"

export const activate = (context: Context) => {
    command(context, "arturo.hello-world", helloWorld)
    command(context, "arturo.runtime.repl", openRepl)
    command(context, "arturo.runtime.run", runFile)
    command(context, "arturo.runtime.bundle", bundleFile)

    command(context, "arturo.meta.report-issue", reportIssue)
    command(context, "arturo.meta.open-docs", openDocs)
    
}

export const deactivate = () => {}
