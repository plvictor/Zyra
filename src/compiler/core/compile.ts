import * as fs from 'fs';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Generator } from './generator';

export class ZyraCompiler {
    compile(sourceCode: string): void {
        console.log("📖 Lendo arquivo src/main.zy...");
        
        try {
            // Análise léxica
            console.log("🔍 Realizando análise léxica...");
            const lexer = new Lexer(sourceCode);
            const tokens = lexer.scanTokens();

            // Análise sintática
            console.log("🔨 Realizando análise sintática...");
            const parser = new Parser(tokens);
            const ast = parser.parse();

            // Geração de código
            console.log("⚡ Gerando código JavaScript...");
            const generator = new Generator();
            const output = generator.generate(ast);

            // Criar diretório dist se não existir
            if (!fs.existsSync('dist')) {
                fs.mkdirSync('dist');
            }

            // Salvar o código gerado
            console.log("💾 Salvando em dist/main.js...");
            fs.writeFileSync('dist/main.js', output);
            
            console.log("✅ Compilação concluída com sucesso!");
            
        } catch (error) {
            console.log("❌ Erro durante a compilação:", error);
            process.exit(1);
        }
    }
}

// Executar compilador
const filename = process.argv[2] || "src/main.zy";
try {
    const sourceCode = fs.readFileSync(filename, 'utf8');
    const compiler = new ZyraCompiler();
    compiler.compile(sourceCode);
} catch (error) {
    console.error("❌ Erro ao ler arquivo:", error);
    process.exit(1);
}