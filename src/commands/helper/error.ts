import * as vscode from 'vscode'

export class Warning extends Error {
    constructor(public message: string) {
        super(message)
        this.name = 'Warning'
    }
}

interface EnsureArgs<T> {
    that: T | (() => T)
    reason: string | string[]
    as?: 'warning' | 'error'
}

function isSupplier<T>(x: T | (() => T)): x is () => T {
    return typeof x === 'function'
}

export const ensure = <T>(args: EnsureArgs<T | null>): NonNullable<T> => {
    const value = isSupplier(args.that)
        ? (args.that as () => T )()
        : (args.that as T)
    const as = args.as ?? 'warning'
    const reason = Array.isArray(args.reason) ? args.reason.join('\n') : args.reason

    if (value === null || value === undefined || !value) {
        if (as === 'warning') {
            throw new Warning(reason)
        } else {
            throw new Error(reason)
        }
    } else {
        return value as NonNullable<T>
    }
}

const handle = (error: unknown) => {
    if (error instanceof Warning) {
        vscode.window.showWarningMessage(error.message)
    } else if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message)
    } else {
        vscode.window.showErrorMessage('An unexpected error occurred.')
    }
}

export const withNotify = <T extends (...args: any[]) => any>(fn: T): T => {
    const wrapped = async function (this: unknown, ...args: Parameters<T>): Promise<ReturnType<T> | void> {
        try {
            return await fn.apply(this, args)
        } catch (error) {
            handle(error)
        }
    }

    return wrapped as unknown as T
}
