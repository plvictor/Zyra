#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const glob = require('glob');
const os = require('os');

// Detect OS and home directory
const HOME = os.homedir();
const IS_WIN = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const IS_LINUX = process.platform === 'linux';

console.log(chalk.blue('🌟 Installing Zyra Language Support...'));

// Common editor paths
const EDITORS = {
    vscode: {
        path: path.join(HOME, IS_WIN ? 'AppData/Roaming/Code/User/extensions' : '.vscode/extensions'),
        install: installVSCode
    },
    sublime: {
        path: path.join(HOME, IS_WIN ? 'AppData/Roaming/Sublime Text/Packages/User' :
            IS_MAC ? 'Library/Application Support/Sublime Text/Packages/User' : '.config/sublime-text/Packages/User'),
        install: installSublime
    },
    atom: {
        path: path.join(HOME, '.atom/packages'),
        install: installAtom
    },
    vim: {
        path: path.join(HOME, IS_WIN ? 'vimfiles' : '.vim'),
        install: installVim
    },
    neovim: {
        path: path.join(HOME, IS_WIN ? 'AppData/Local/nvim' : '.config/nvim'),
        install: installNeovim
    },
    emacs: {
        path: path.join(HOME, '.emacs.d'),
        install: installEmacs
    },
    // Add more editors here
};

// Language Server setup
function setupLanguageServer() {
    console.log(chalk.yellow('📡 Setting up Language Server...'));
    
    const serverPath = path.join(__dirname, '../server');
    if (!fs.existsSync(serverPath)) {
        fs.mkdirSync(serverPath, { recursive: true });
    }

    // Copy language server files
    const serverFiles = glob.sync(path.join(__dirname, '../src/server/**/*'));
    serverFiles.forEach(file => {
        const dest = path.join(serverPath, path.relative(path.join(__dirname, '../src/server'), file));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
    });
}

// Editor-specific installations
function installVSCode(editorPath) {
    const extensionPath = path.join(editorPath, 'zyra-language');
    fs.mkdirSync(extensionPath, { recursive: true });
    
    // Copy extension files
    const files = glob.sync(path.join(__dirname, '../editors/vscode/**/*'));
    files.forEach(file => {
        const dest = path.join(extensionPath, path.relative(path.join(__dirname, '../editors/vscode'), file));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
    });
}

function installSublime(editorPath) {
    const packagePath = path.join(editorPath, 'Zyra');
    fs.mkdirSync(packagePath, { recursive: true });
    
    // Copy syntax files
    fs.copyFileSync(
        path.join(__dirname, '../editors/sublime/Zyra.sublime-syntax'),
        path.join(packagePath, 'Zyra.sublime-syntax')
    );
}

function installAtom(editorPath) {
    const packagePath = path.join(editorPath, 'language-zyra');
    fs.mkdirSync(packagePath, { recursive: true });
    
    // Copy package files
    const files = glob.sync(path.join(__dirname, '../editors/atom/**/*'));
    files.forEach(file => {
        const dest = path.join(packagePath, path.relative(path.join(__dirname, '../editors/atom'), file));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
    });
}

function installVim(editorPath) {
    const syntaxPath = path.join(editorPath, 'syntax');
    const ftdetectPath = path.join(editorPath, 'ftdetect');
    
    fs.mkdirSync(syntaxPath, { recursive: true });
    fs.mkdirSync(ftdetectPath, { recursive: true });
    
    // Copy vim syntax files
    fs.copyFileSync(
        path.join(__dirname, '../editors/vim/syntax/zyra.vim'),
        path.join(syntaxPath, 'zyra.vim')
    );
    
    fs.copyFileSync(
        path.join(__dirname, '../editors/vim/ftdetect/zyra.vim'),
        path.join(ftdetectPath, 'zyra.vim')
    );
}

function installNeovim(editorPath) {
    const syntaxPath = path.join(editorPath, 'syntax');
    const ftdetectPath = path.join(editorPath, 'ftdetect');
    
    fs.mkdirSync(syntaxPath, { recursive: true });
    fs.mkdirSync(ftdetectPath, { recursive: true });
    
    // Copy neovim files
    fs.copyFileSync(
        path.join(__dirname, '../editors/neovim/syntax/zyra.vim'),
        path.join(syntaxPath, 'zyra.vim')
    );
    
    fs.copyFileSync(
        path.join(__dirname, '../editors/neovim/ftdetect/zyra.vim'),
        path.join(ftdetectPath, 'zyra.vim')
    );
}

function installEmacs(editorPath) {
    const modePath = path.join(editorPath, 'zyra-mode');
    fs.mkdirSync(modePath, { recursive: true });
    
    // Copy emacs mode files
    fs.copyFileSync(
        path.join(__dirname, '../editors/emacs/zyra-mode.el'),
        path.join(modePath, 'zyra-mode.el')
    );
}

// Main installation process
function install() {
    try {
        // Setup Language Server first
        setupLanguageServer();
        
        // Install for each detected editor
        Object.entries(EDITORS).forEach(([editor, config]) => {
            if (fs.existsSync(config.path)) {
                console.log(chalk.yellow(`📦 Installing for ${editor}...`));
                config.install(config.path);
                console.log(chalk.green(`✅ ${editor} support installed!`));
            }
        });

        // Create global commands
        const binPath = path.join(__dirname, '../bin');
        if (!fs.existsSync(binPath)) {
            fs.mkdirSync(binPath, { recursive: true });
        }

        // Make zyra command executable
        if (!IS_WIN) {
            try {
                execSync(`chmod +x ${path.join(binPath, 'zyra')}`);
            } catch (error) {
                console.warn(chalk.yellow('⚠️ Could not make zyra command executable'));
            }
        }

        console.log(chalk.green(`
🎉 Zyra installation complete!

Your files with .zy extension will now have:
✨ Syntax highlighting in all editors
🎨 Smart code completion
📝 Error checking
🔍 Jump to definition
🎯 Find references
🚀 And much more!

To start using Zyra:
1. Create a new file with .zy extension
2. Start coding!

For help, run: zyra --help
`));

    } catch (error) {
        console.error(chalk.red('❌ Installation failed:'), error);
        process.exit(1);
    }
}

// Run installation
install(); 