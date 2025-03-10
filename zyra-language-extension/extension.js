const vscode = require('vscode');

function activate(context) {
    console.log('Zyra Language Extension is now active!');

    // Register language features
    let disposable = vscode.languages.registerHoverProvider('zyra', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            // Add hover information for keywords
            const keywords = {
                'component': 'Creates a reusable UI component',
                'state': 'Declares component state variables',
                'props': 'Declares component properties',
                'style': 'Defines component styles',
                'render': 'Specifies component rendering logic',
                'socket': 'Creates a WebSocket server',
                'on': 'Registers an event handler'
            };

            if (keywords[word]) {
                return new vscode.Hover(keywords[word]);
            }
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 