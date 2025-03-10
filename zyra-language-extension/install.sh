#!/bin/bash

# Criar diretório de extensões do VSCode se não existir
VSCODE_EXTENSIONS="$HOME/.vscode/extensions"
mkdir -p "$VSCODE_EXTENSIONS"

# Nome do diretório da extensão
EXTENSION_DIR="$VSCODE_EXTENSIONS/zyra-language"

# Remover instalação anterior se existir
rm -rf "$EXTENSION_DIR"

# Copiar arquivos da extensão
cp -r . "$EXTENSION_DIR"

echo "✨ Extensão Zyra instalada com sucesso!"
echo "🔄 Por favor, reinicie o VSCode para ativar a extensão." 