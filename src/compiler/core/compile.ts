import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Generator } from './generator';

class ZyraCompiler {
    compile(sourceFile: string, outputFile: string) {
        try {
            // Ler arquivo fonte
            console.log(`📖 Lendo arquivo ${sourceFile}...`);
            const source = readFileSync(sourceFile, 'utf-8');

            // Análise léxica
            console.log('🔍 Realizando análise léxica...');
            const lexer = new Lexer(source);
            const tokens = lexer.scanTokens();

            // Análise sintática
            console.log('🔨 Realizando análise sintática...');
            const parser = new Parser(tokens);
            const ast = parser.parse();

            // Geração de código
            console.log('⚡ Gerando código JavaScript...');
            const generator = new Generator();
            const output = generator.generate(ast);

            // Escrever arquivo de saída
            console.log(`💾 Salvando em ${outputFile}...`);
            writeFileSync(outputFile, output);

            console.log('✅ Compilação concluída com sucesso!');
        } catch (error) {
            console.error('❌ Erro durante a compilação:', error);
            process.exit(1);
        }
    }
}

// Executar compilação
const compiler = new ZyraCompiler();
const sourceFile = process.argv[2] || 'src/main.zy';
const outputFile = process.argv[3] || 'dist/main.js';

compiler.compile(sourceFile, outputFile); 