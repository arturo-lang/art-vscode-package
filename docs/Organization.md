# Project Organization

Our organization is focused on be descriptive as possible. We tried to remove all the mess with strange naming conventions to make it easier to organize and find stuff.

As a Vscode extension developer, you may ask where are `language-configuration.json` or `arturo.tmLanguage.json`. The answer is quite simple, they are not that descriptive with their intent. What is a `tm`? Why is `language-configuration` on root, if this is grammar related? Let's see what we have done.

## Configuration

On the root folder, you'll find the project configuration files.

- `README.md`: This shows the extension description and features. Not only on Github, but also on the Marketplace.
- `package.json`: Default configuration file for NodeJS. This also is used to configure the extension. Don't worry too much, this file is generally big and will mix our extension settings with npm settings... Until I know, there is no way to decouple it.
- `package-lock.json`: This is important for CI. Just don't remove it. This stores a "cache" of the package resolution.
- `tsconfig.json`: This project uses Typescript as source code, so we need this to configure Typescript correctly.
- `mise.toml`: Mise settings to have the correct node version. See [Setup Instructions](./Setup.md) for more instructions.
- `LICENSE`: License guarantee of usage.
- `.gitignore`: Ignores build output, that should not be on the repository.

## Documentation

This sounds obvious, but the documentation is found on the `docs/` folder. Here we document design decisions and architecture.

WIth futher work, we may also document some cases of our internal API.

## Grammar

All grammar stuff is inside the `grammar/` folder: Syntax hightlight and language helper (such as auto commenting, auto closing pairs...).

- `grammar/definition.json`: Tells VsCode about the grammar definition of Arturo. This is responsible for the syntax highlighting. The same as `arturo.tmLanguage.json`.
- `grammar/config.json`: Tells VsCode about some minimal semantics to make our life easier when writting Arturo code. This is not related to LSP, but simple rules, such as Auto-comment code by using <kbd>Ctrl</kbd> + <kbd>;</kdb> or auto closing pairs for `[]` and `""`...

## Icons

`icons` folder is very obvious about what it is about. In this folder, you find all Arturo icons that may be used on this extension. All the icons have semantic and short names.

Originally, the name of this file was `images`, and this is what VsCode recommends on its documentation. But this was not clear enough to me, since images would be whatever, a screenshot, a diagram, etc.

## Snippets

Here we save all our snippets. This helps a lot on development, and we should make sure we have them correctly and updated with our library. The idea is not to cover the whole library, but the most used functions with obvious things.

### Snippets Rules

Each library has its own snippet, and the reason is that it makes it easier to us to maintain it.

The order of the cursor should follow the order of the function parameters, since the most important one is the first one, generally. For attributes, we recommend to put them on the beginning, but being the last cursor order.

More complex functions should get a description from the original documentation, but obvious functions don't need description for the sake of simplicity and maintainance. Let's not repeat ourselves when not needed.

When implementing iterators, remember that there are multiple ways of declaring them. You may: use a custom element name, default `x` or `i` name, use fat-arrow, or have a full body, so this should have alternatives when possible. `loop`, `while`, are more suitable to use multiline blocky body, since we generally write multiple statements inside. `map`, by other hand, are generally shorter and we generally write only a single statement, using arrow body.

**Simple and obvious function:**

```json
"Add": {
    "prefix": "add",
    "body": ["add $1 $2"]
}
```

**Not obvious function:**

```json
"Coalesce operator": {
    "prefix": ["coalesce", "otherwise", "??"],
    "body": ["${1:expr1} ?? ${2:expr2}"],
    "description": "If first value is null or false, return second value; otherwise return the first one."
}
```

**Alternatives:**

Using symbols sometimes is more suitable:

```json
"Add": { "prefix": "add", "body": ["$1 + $2"] }
```

This iterator has many ways to be typed. Notice that none of them use multiline blocky body, since `map` often gets a single statement:

```json
"Map": {
    "prefix": "map",
    "body": [ "map ${1:container} '${2:it} -> ${3:code}" ]
},
    
"Map (Short)": {
    "prefix": "map",
    "body": [ "map ${1:container} => [${2:code}]" ]
},

"Map (X)": {
    "prefix": "map",
    "body": [ "map ${1:container} 'x -> ${2:code}" ]
}
```

`loop`, by other hand often gets multiple statements on its body, so:

```json
"Loop": {
    "prefix": "loop",
    "body": [
        "loop ${1:container} [${2:element}] [",
        "    ${3:code}",
        "]"
    ]
},

"Loop (with: i)": {
    "prefix": "loop.with",
    "body": [
        "loop.with: 'i ${1:container} [${2:element}] [",
        "    ${3:code}",
        "]"
    ]
}
```

**With optionals**

The optional's message is in the last order:

```json
"Ensure": {
    "prefix": "ensure",
    "body": ["ensure.that: \"${2:message}\" -> ${1:expression}"],
}
```

## Source Code

The source code goes inside `src` and this is responsible for handling operations that needs Typescrip/Javascript to operate: Commands, Terminal Interaction, Error Providers, Semantic Syntax, LSP, Custom UI/UX and so on...

### Commands

Commands are declared into `src/commands` folder. Its helper function goes into the `src/commands/helper` folder. Commands are organized by scope (`meta.ts`, `package.ts`, `runtime.ts`) and its documentation should be on the source code to avoid inconsistencies.

To activate a command, we do it on the file `src/extension.ts`, which assigns it by using the `command` custom function. This function comes from `src/helper.ts` and has the intend of reducing VsCode library's boilerplate code.
