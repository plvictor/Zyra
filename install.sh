#!/bin/bash

echo "🌟 Instalando suporte para a linguagem Zyra..."

# VSCode
VSCODE_EXTENSIONS="$HOME/.vscode/extensions"
VSCODE_DIR="$VSCODE_EXTENSIONS/zyra-language"
if [ -d "$VSCODE_EXTENSIONS" ]; then
    echo "📦 Instalando extensão para VSCode..."
    rm -rf "$VSCODE_DIR"
    mkdir -p "$VSCODE_DIR"
    cp -r zyra-language-extension/* "$VSCODE_DIR"
    echo "✅ Extensão VSCode instalada!"
fi

# Sublime Text
SUBLIME_DIR="$HOME/Library/Application Support/Sublime Text/Packages/User"
if [ -d "$SUBLIME_DIR" ]; then
    echo "📦 Instalando sintaxe para Sublime Text..."
    mkdir -p "$SUBLIME_DIR/Zyra"
    cp zyra-language-extension/sublime/Zyra.sublime-syntax "$SUBLIME_DIR/Zyra/"
    echo "✅ Sintaxe Sublime Text instalada!"
fi

# Atom
ATOM_DIR="$HOME/.atom/packages"
if [ -d "$ATOM_DIR" ]; then
    echo "📦 Instalando pacote para Atom..."
    mkdir -p "$ATOM_DIR/language-zyra"
    cp -r zyra-language-extension/atom/* "$ATOM_DIR/language-zyra/"
    echo "✅ Pacote Atom instalado!"
fi

# Vim
VIM_DIR="$HOME/.vim"
if [ -d "$VIM_DIR" ]; then
    echo "📦 Instalando sintaxe para Vim..."
    mkdir -p "$VIM_DIR/syntax"
    cat > "$VIM_DIR/syntax/zyra.vim" << 'EOL'
" Vim syntax file for Zyra
if exists("b:current_syntax")
    finish
endif

" Keywords
syn keyword zyraKeyword component state props style render function if else for while return import export from socket on async await try catch finally new class let const this null true false
syn keyword zyraType Map Set Date Array String Number Boolean Promise Error
syn keyword zyraFunction console document window fetch socket

" Strings
syn region zyraString start=/"/ end=/"/
syn region zyraString start=/'/ end=/'/
syn region zyraTemplate start=/`/ end=/`/

" Numbers
syn match zyraNumber "\<\d\+\>"
syn match zyraNumber "\<\d\+\.\d\+\>"

" Colors
syn match zyraColor "#[0-9A-Fa-f]\{3\}\>"
syn match zyraColor "#[0-9A-Fa-f]\{6\}\>"

" Comments
syn match zyraComment "//.*$"
syn region zyraComment start="/\*" end="\*/"

" CSS Properties
syn match zyraCssProperty "\<\(display\|position\|margin\|padding\|width\|height\|color\|background\|font-size\|border\|flex\|grid\)\(-[a-z]\+\)*\>"

" Highlighting
hi def link zyraKeyword Keyword
hi def link zyraType Type
hi def link zyraFunction Function
hi def link zyraString String
hi def link zyraTemplate String
hi def link zyraNumber Number
hi def link zyraColor Constant
hi def link zyraComment Comment
hi def link zyraCssProperty Identifier

let b:current_syntax = "zyra"
EOL

    # Configurar detecção automática de tipo de arquivo
    mkdir -p "$VIM_DIR/ftdetect"
    echo 'au BufRead,BufNewFile *.zy set filetype=zyra' > "$VIM_DIR/ftdetect/zyra.vim"
    echo "✅ Sintaxe Vim instalada!"
fi

# Emacs
EMACS_DIR="$HOME/.emacs.d"
if [ -d "$EMACS_DIR" ]; then
    echo "📦 Instalando modo para Emacs..."
    mkdir -p "$EMACS_DIR/zyra-mode"
    cat > "$EMACS_DIR/zyra-mode/zyra-mode.el" << 'EOL'
;;; zyra-mode.el --- Major mode for editing Zyra files

(defvar zyra-mode-hook nil)

(defvar zyra-mode-map
  (let ((map (make-sparse-keymap)))
    map)
  "Keymap for Zyra major mode")

(defconst zyra-keywords
  '("component" "state" "props" "style" "render" "function" "if" "else" "for" "while" "return" "import" "export" "from" "socket" "on" "async" "await" "try" "catch" "finally" "new" "class" "let" "const" "this" "null" "true" "false"))

(defconst zyra-types
  '("Map" "Set" "Date" "Array" "String" "Number" "Boolean" "Promise" "Error"))

(defconst zyra-functions
  '("console" "document" "window" "fetch" "socket"))

(defvar zyra-font-lock-keywords
  `((,(regexp-opt zyra-keywords 'words) . font-lock-keyword-face)
    (,(regexp-opt zyra-types 'words) . font-lock-type-face)
    (,(regexp-opt zyra-functions 'words) . font-lock-function-name-face)
    ("#[0-9A-Fa-f]\\{3,6\\}" . font-lock-constant-face)
    ("\\<\\d+\\(\\.\\d+\\)?\\(px\\|em\\|rem\\|vh\\|vw\\|%\\)\\>" . font-lock-constant-face)
    ("//.*$" . font-lock-comment-face)
    ("/\\*.*\\*/" . font-lock-comment-face)))

;;;###autoload
(define-derived-mode zyra-mode prog-mode "Zyra"
  "Major mode for editing Zyra files"
  (setq font-lock-defaults '(zyra-font-lock-keywords)))

;;;###autoload
(add-to-list 'auto-mode-alist '("\\.zy\\'" . zyra-mode))

(provide 'zyra-mode)
EOL
    echo "✅ Modo Emacs instalado!"
fi

echo "
🎉 Instalação concluída!

Para ativar o suporte em cada editor:

VSCode: Reinicie o VSCode
Sublime Text: Reinicie o Sublime Text
Atom: Reinicie o Atom
Vim: Adicione 'syntax on' ao seu .vimrc
Emacs: Adicione (require 'zyra-mode) ao seu .emacs

Agora seus arquivos .zy terão:
✨ Syntax highlighting
🎨 Cores para keywords, strings, números
📝 Suporte a comentários
🔍 Auto-completar parênteses e chaves
🎯 Ícone personalizado (no VSCode)

Divirta-se programando em Zyra! 🚀" 