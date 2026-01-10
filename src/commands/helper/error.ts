import * as vscode from 'vscode'

/** Represents a warning condition. */
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

/** Type guard to check if a value is a supplier function. */
function isSupplier<T>(x: T | (() => T)): x is () => T {
    return typeof x === 'function'
}

/** Ensures that a value is not null, undefined, or falsy.
 * 
 * If the value is invalid, throws an error or warning with the provided reason.
 */
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

/** Handles an error by showing an appropriate message to the user. */
const handle = (error: unknown) => {
    if (error instanceof Warning) {
        vscode.window.showWarningMessage(error.message)
    } else if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message)
    } else {
        vscode.window.showErrorMessage('An unexpected error occurred.')
    }
}

/** Wraps a function to automatically notify the user of errors.*/
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
