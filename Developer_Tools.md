# Developer Tools

Some helpful info on editor plugins that will make working on this repo easier.

## VSCode

Command Shift P - to install extensions manually

- [Vetur - octref.vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) Vuejs syntax + linting
- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) Language support for Vue 3
- [EditorConfig for VS Code - EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) for enforcing code styles.
- [ESlint - dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Javascript linting.
- [Stylelint - stylelint.vscode-stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) for scss linting.
- [Vue VSCode Snippets - sdras.vue-vscode-snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) VueJS code snippets
- [GraphQL - graphql.vscode-graphql](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) GraphQL Syntax support.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) Quickly find Tailwind class options

> Search the name (ex. octref.vetur or shinn.stylelint) into the Extensions area to install within VSCode

Install all extensions via the command line

> First requires that VSCode is in your PATH variable. From VSCode Command Palette (⇧⌘P) execute command "Shell Command: Install 'code' command in PATH"

```bash
code --install-extension octref.vetur && code --install-extension Vue.volar && code --install-extension EditorConfig.EditorConfig && code --install-extension dbaeumer.vscode-eslint && code --install-extension stylelint.vscode-stylelint && code --install-extension sdras.vue-vscode-snippets && code --install-extension GraphQL.vscode-graphql && code --install-extension bradlc.vscode-tailwindcss
```

### VSCode Setup for Eslint

Workspace Settings

> Generate the .vscode folder with a settings.json inside and apply your workspace settings in that file (.vscode is already in our .gitignore file)

Basic ESLint integration

> Should be enabled by default

ESLint auto fix

> If you would like ESLint to automatically fix auto-fixable errors when you save a file

```json
{
    /* Other workspace settings...  */
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.fixAll.eslint": true,
        "source.fixAll.tslint": true,
        "source.fixAll.stylelint": true
    }
}
```

## PHPStorm

[SCSS Style Linting](https://github.com/Jardinero/stylelint-plugin)

## Chrome : Extensions

- [Apollo Client Developer Tools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm)
- [Vue.js Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
