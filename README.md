<h1 align="center">
    Arturo for VS Code
</h1>

<p align="center">
<i>First-class editing, running, and package management support directly inside your favorite text editor.</i>
<br>
<br><br>
<img 
    alt="Arturo logo" 
    width="20" 
    src="https://github.com/arturo-lang/arturo/raw/master/docs/images/logo.png#gh-light-mode-only"
/>
<img 
    alt="Arturo logo" 
    width="20" 
    src="https://github.com/arturo-lang/arturo/raw/master/docs/images/logo-lightgray.png#gh-dark-mode-only" 
/>
<br>
<b>~ CODE IS ART ~</b>
</p>

<p align="center">
    <img alt="GitHub License" src="https://img.shields.io/github/license/arturo-lang/vscode-extension?style=flat-square"><img alt="Visual Studio Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/drkameleon.arturo?style=flat-square&label=Downloads%20on%20VS%20Code&labelColor=blue&color=black&cacheSeconds=30&link=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Ddrkameleon.arturo">
</p>

## Requirements
- VS Code 1.52.0 or newer
- Arturo available on your PATH (used for running, bundling, REPL, and package commands)

See how to install Arturo on our [official website](https://arturo-lang.io/).

## Highlights
- Syntax highlighting for Arturo files.
- Distinct file icons (gray for code, purple for tests/config) supporting both light and dark themes.
- Ready-to-use snippets for core language constructs (arithmetic, collections, logic, IO, numbers, strings, types, and more)
- One-click run of the active file, with diagnostics for runtime errors.
- Built-in REPL launcher and bundler workflow.
- Integrated package manager commands (install, uninstall, list, remote, update all).
- Quick links to documentation and a prefilled issue reporter.

### Commands
You can find these in the Command Palette (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) under "Arturo:". The run-current command also appears in the editor title bar for Arturo files.

| Command | Purpose |
| --- | --- |
| Arturo: Open REPL | Launch an Arturo REPL in a new terminal |
| Arturo: Run File | Choose any `.art` file in the workspace and run it with diagnostics |
| Arturo: Run Current File | Run the active Arturo file; saves unsaved edits and surfaces errors inline |
| Arturo: Bundle File | Pick a script and produce a bundled executable (optional custom output name) |
| Arturo: Install Package | Prompt for a package name and install it via `arturo --package install` |
| Arturo: Uninstall Package | Remove a package via `arturo --package uninstall` |
| Arturo: List Installed Packages | Show locally installed packages |
| Arturo: List Registered Packages | List remote/registered packages |
| Arturo: Update All Packages | Update every installed package |
| Arturo: Open Documentation | Open the Arturo library docs in a side webview (falls back to browser) |
| Arturo: Report Issue | Open GitHub issues with system details prefilled |

### Grammar
- Applies syntax highlight to any Arturo file.
- This also supports language config to enhance our editor integration, such as quick comment code or auto-closing pair characters...

### Reporting Issues and Reading the Docs

- `Arturo: Open Documentation` opens the latest library docs beside your editor.
- `Arturo: Report Issue` opens the GitHub issue form with OS, Arturo, VS Code, and extension versions prefilled to speed up triage.

## Installation
- From the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=drkameleon.arturo).
- From source: clone the repo, run `npm install`, then `npm run compile`. Launch the extension host with <kbd>F5</kbd>. See [docs/Setup.md](docs/Setup.md) for full contributor setup.

## Contributing

PRs and Issues are welcome. 
Please check [docs/Contributing.md](docs/Contributing.md) before submitting changes.
