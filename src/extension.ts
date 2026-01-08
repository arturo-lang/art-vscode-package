import { command, Context } from "./helper"

import { helloWorld } from "./commands/hello"
import { bundleFile, openRepl, runFile } from "./commands/runtime"

export const activate = (context: Context) => {
    command(context, "arturo.hello-world", helloWorld)
    command(context, "arturo.runtime.repl", openRepl)
    command(context, "arturo.runtime.run", runFile)
    command(context, "arturo.runtime.bundle", bundleFile)
}

export const deactivate = () => {}
