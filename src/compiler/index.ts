/**
 * Compilador da Linguagem Zyra
 * 
 * Este é o ponto de entrada principal do compilador que transforma
 * código Zyra em JavaScript para execução no navegador e no servidor.
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';
import { generateClientCode } from './generators/client';
import { generateServerCode } from './generators/server';
import { validateAST } from './validator';
import { ZyraCompilerOptions, CompilationResult } from './types';

/**
 * Compila um arquivo Zyra para JavaScript
 * 
 * @param filePath Caminho para o arquivo .zy a ser compilado
 * @param options Opções de compilação
 * @returns Resultado da compilação com código cliente e servidor
 */
export async function compileFile(
  filePath: string, 
  options: ZyraCompilerOptions = {}
): Promise<CompilationResult> {
  try {
    // Ler o arquivo fonte
    const source = fs.readFileSync(filePath, 'utf-8');
    
    // Compilar o código
    return await compile(source, {
      ...options,
      filename: path.basename(filePath),
      basePath: path.dirname(filePath)
    });
  } catch (error) {
    console.error(`Erro ao compilar arquivo ${filePath}:`, error);
    throw error;
  }
}

/**
 * Compila código fonte Zyra para JavaScript
 * 
 * @param source Código fonte Zyra
 * @param options Opções de compilação
 * @returns Resultado da compilação com código cliente e servidor
 */
export async function compile(
  source: string, 
  options: ZyraCompilerOptions = {}
): Promise<CompilationResult> {
  try {
    // Analisar o código fonte para AST
    const ast = parse(source);
    
    // Validar a AST
    validateAST(ast);
    
    // Gerar código JavaScript para o cliente
    const clientCode = generateClientCode(ast, options);
    
    // Gerar código JavaScript para o servidor
    const serverCode = generateServerCode(ast, options);
    
    return {
      clientCode,
      serverCode,
      ast
    };
  } catch (error) {
    console.error('Erro durante a compilação:', error);
    throw error;
  }
}

/**
 * Compila um projeto Zyra inteiro
 * 
 * @param projectPath Caminho para o diretório do projeto
 * @param options Opções de compilação
 */
export async function compileProject(
  projectPath: string,
  options: ZyraCompilerOptions = {}
): Promise<void> {
  try {
    console.log(`Compilando projeto em ${projectPath}...`);
    
    // Encontrar o arquivo principal (main.zy)
    const mainFilePath = path.join(projectPath, 'src', 'main.zy');
    
    if (!fs.existsSync(mainFilePath)) {
      throw new Error(`Arquivo principal não encontrado: ${mainFilePath}`);
    }
    
    // Compilar o arquivo principal e todos os seus imports
    await compileFile(mainFilePath, {
      ...options,
      outputDir: path.join(projectPath, 'dist')
    });
    
    console.log('Compilação concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao compilar projeto:', error);
    throw error;
  }
}

// Exportar outras partes do compilador
export * from './parser';
export * from './types';
export * from './validator';
export * from './generators/client';
export * from './generators/server'; 