import { compiler } from '../src/compiler/zyra';
import * as fs from 'fs';
import * as path from 'path';

function findZyraFiles(dir: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...findZyraFiles(fullPath));
        } else if (item.endsWith('.zy')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

function build() {
    console.log('🚀 Iniciando build do projeto Zyra...');
    
    // Encontrar todos os arquivos .zy
    const sourceDir = path.join(process.cwd(), 'src');
    const zyraFiles = findZyraFiles(sourceDir);
    
    console.log(`📦 Encontrados ${zyraFiles.length} arquivos Zyra`);
    
    // Compilar cada arquivo
    for (const file of zyraFiles) {
        console.log(`🔨 Compilando ${path.relative(process.cwd(), file)}`);
        try {
            compiler.compileFile(file);
            console.log(`✅ Compilado com sucesso!`);
        } catch (error) {
            console.error(`❌ Erro ao compilar ${file}:`, error);
        }
    }
    
    console.log('🎉 Build concluído!');
}

build(); 