/**
 * Definições de tipos para o compilador Zyra
 */

// Opções de compilação
export interface ZyraCompilerOptions {
  // Caminho base para resolução de imports
  basePath?: string;
  
  // Nome do arquivo sendo compilado
  filename?: string;
  
  // Diretório de saída para os arquivos compilados
  outputDir?: string;
  
  // Modo de compilação (development ou production)
  mode?: 'development' | 'production';
  
  // Se deve gerar source maps
  sourceMap?: boolean;
  
  // Se deve minificar o código de saída
  minify?: boolean;
  
  // Configurações específicas do projeto
  projectConfig?: ProjectConfig;
}

// Configuração do projeto
export interface ProjectConfig {
  // Nome do projeto
  name: string;
  
  // Versão do projeto
  version: string;
  
  // Descrição do projeto
  description?: string;
  
  // Configurações de tema
  theme?: ThemeConfig;
  
  // Dependências externas
  dependencies?: Record<string, string>;
}

// Configuração de tema
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  [key: string]: string | undefined;
}

// Resultado da compilação
export interface CompilationResult {
  // Código JavaScript gerado para o cliente
  clientCode: string;
  
  // Código JavaScript gerado para o servidor
  serverCode: string;
  
  // AST (Abstract Syntax Tree) do código fonte
  ast: ASTNode;
}

// Nó da AST (Abstract Syntax Tree)
export interface ASTNode {
  type: string;
  [key: string]: any;
}

// Tipos de nós da AST
export enum NodeType {
  Program = 'Program',
  Import = 'Import',
  Component = 'Component',
  Server = 'Server',
  App = 'App',
  Model = 'Model',
  Function = 'Function',
  Property = 'Property',
  State = 'State',
  Render = 'Render',
  Element = 'Element',
  Attribute = 'Attribute',
  Event = 'Event',
  Expression = 'Expression',
  Literal = 'Literal',
  Identifier = 'Identifier',
  BinaryExpression = 'BinaryExpression',
  CallExpression = 'CallExpression',
  ConditionalExpression = 'ConditionalExpression',
  IfStatement = 'IfStatement',
  ForStatement = 'ForStatement',
  WhileStatement = 'WhileStatement',
  ReturnStatement = 'ReturnStatement',
  VariableDeclaration = 'VariableDeclaration',
  ApiEndpoint = 'ApiEndpoint',
  EventHandler = 'EventHandler'
}

// Tipos de elementos de UI
export enum ElementType {
  Container = 'container',
  Row = 'row',
  Column = 'column',
  Text = 'text',
  Heading = 'heading',
  Button = 'button',
  Input = 'input',
  Image = 'image',
  List = 'list',
  ListItem = 'listItem',
  Form = 'form',
  Link = 'link',
  Card = 'card',
  Spinner = 'spinner',
  Custom = 'custom'
}

// Tipos de dados
export enum DataType {
  Text = 'text',
  Number = 'number',
  Boolean = 'boolean',
  List = 'list',
  Map = 'map',
  Function = 'function',
  Any = 'any',
  UUID = 'uuid',
  Timestamp = 'timestamp'
}

// Erro de compilação
export class CompilationError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number,
    public filename?: string
  ) {
    super(message);
    this.name = 'CompilationError';
  }
} 