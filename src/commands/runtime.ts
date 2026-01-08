import * as vscode from 'vscode'

import {selectScript} from "./helper/ui"
import { arturo } from './helper/arturo';


export const openRepl = () => {
	arturo('REPL', '--repl')
};

export const runFile = async () => {
	const file = await selectScript()
    if (!file) return

	arturo('Run', `"${file}"`)
}
	terminal.show(true)
	terminal.sendText(`arturo "${file}"`)
}