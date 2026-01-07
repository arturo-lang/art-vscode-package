import { command, Context } from "./helper"
import { helloWorld } from "./commands/hello"

export const activate = (context: Context) => {
    command(context, "arturo.hello-world", helloWorld)
}

export const deactivate = () => {}
