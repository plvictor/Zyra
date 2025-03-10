import { Token, TokenType } from './lexer';

export interface Node {
    type: string;
    [key: string]: any;
}

export class Parser {
    private tokens: Token[] = [];
    private current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Node[] {
        const nodes: Node[] = [];
        while (!this.isAtEnd()) {
            nodes.push(this.declaration());
        }
        return nodes;
    }

    private declaration(): Node {
        // Ignorar comentários
        while (this.match(TokenType.COMMENT)) {
            // Não faz nada, apenas avança
        }

        if (this.match(TokenType.IMPORT)) return this.importDeclaration();
        if (this.match(TokenType.APP)) return this.appDeclaration();
        if (this.match(TokenType.SERVER)) return this.serverDeclaration();
        if (this.match(TokenType.COMPONENT)) return this.componentDeclaration();
        if (this.match(TokenType.PAGE)) return this.pageDeclaration();
        
        throw this.error(this.peek(), "Esperava uma declaração.");
    }

    private importDeclaration(): Node {
        const imports: { name: string, alias?: string }[] = [];
        
        if (this.match(TokenType.LEFT_BRACE)) {
            // Importação com chaves
            do {
                const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do import.");
                let alias = name.lexeme;
                
                if (this.match(TokenType.AS)) {
                    const aliasToken = this.consume(TokenType.IDENTIFIER, "Esperava alias após 'as'.");
                    alias = aliasToken.lexeme;
                }
                
                imports.push({ name: name.lexeme, alias });
            } while (this.match(TokenType.COMMA));
            
            this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após lista de imports.");
        } else {
            // Importação sem chaves
            const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do import.");
            let alias = name.lexeme;
            
            if (this.match(TokenType.AS)) {
                const aliasToken = this.consume(TokenType.IDENTIFIER, "Esperava alias após 'as'.");
                alias = aliasToken.lexeme;
            }
            
            imports.push({ name: name.lexeme, alias });
        }
        
        this.consume(TokenType.FROM, "Esperava 'from' após import.");
        const source = this.consume(TokenType.STRING, "Esperava string com caminho do módulo.");
        this.consume(TokenType.SEMICOLON, "Esperava ';' após declaração de import.");
        
        return {
            type: "ImportDeclaration",
            imports,
            source: source.literal
        };
    }

    private appDeclaration(): Node {
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após 'app'.");
        
        const properties: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            // Ignorar comentários
            while (this.match(TokenType.COMMENT)) {
                // Não faz nada, apenas avança
            }

            if (this.check(TokenType.RIGHT_BRACE)) break;

            // Chave da propriedade pode ser um identificador ou uma string
            let name: Token;
            if (this.match(TokenType.IDENTIFIER)) {
                name = this.previous();
            } else if (this.match(TokenType.STRING)) {
                name = this.previous();
            } else {
                throw this.error(this.peek(), "Esperava nome da propriedade.");
            }
            
            if (this.match(TokenType.COLON)) {
                // Propriedade
                let value: Node;
                if (this.match(TokenType.LEFT_BRACE)) {
                    value = this.block();
                } else {
                    value = this.expression();
                    this.consume(TokenType.SEMICOLON, "Esperava ';' após valor da propriedade.");
                }
                
                properties.push({
                    type: "Property",
                    name: name.lexeme,
                    value
                });
            } else if (this.match(TokenType.LEFT_BRACE)) {
                // Objeto aninhado sem dois pontos
                const value = this.block();
                
                properties.push({
                    type: "Property",
                    name: name.lexeme,
                    value
                });
            } else {
                throw this.error(this.peek(), "Esperava ':' ou '{' após nome da propriedade.");
            }
        }
        
        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após corpo do app.");
        
        return {
            type: "AppDeclaration",
            properties
        };
    }

    private serverDeclaration(): Node {
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após 'server'");
        
        const properties: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            // Ignorar comentários
            while (this.match(TokenType.COMMENT)) {
                // Não faz nada, apenas avança
            }

            if (this.check(TokenType.RIGHT_BRACE)) break;

            if (this.match(TokenType.SOCKET)) {
                properties.push(this.socketDeclaration());
            } else if (this.match(TokenType.IDENTIFIER)) {
                const name = this.previous().lexeme;
                
                if (name === "api") {
                    properties.push(this.apiDeclaration());
                } else if (this.match(TokenType.COLON)) {
                    const value = this.expression();
                    this.consume(TokenType.SEMICOLON, "Esperava ';' após valor da propriedade");
                    
                    properties.push({
                        type: "Property",
                        name,
                        value
                    });
                } else if (this.match(TokenType.LEFT_BRACE)) {
                    const block = this.block();
                    
                    properties.push({
                        type: "Property",
                        name,
                        value: block
                    });
                } else {
                    throw this.error(this.peek(), "Esperava ':' ou '{' após nome da propriedade");
                }
            } else {
                throw this.error(this.peek(), "Esperava nome da propriedade");
            }
        }
        
        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após corpo do servidor");
        
        return {
            type: "ServerDeclaration",
            properties
        };
    }

    private apiDeclaration(): Node {
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após 'api'");
        
        const endpoints: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            if (this.match(TokenType.STRING)) {
                const path = this.previous().literal;
                this.consume(TokenType.LEFT_BRACE, "Esperava '{' após caminho da API");
                
                const properties: Node[] = [];
                while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                    if (this.match(TokenType.IDENTIFIER)) {
                        const name = this.previous().lexeme;
                        
                        if (name === "handler") {
                            properties.push(this.handlerDeclaration());
                        } else if (this.match(TokenType.COLON)) {
                            const value = this.expression();
                            this.consume(TokenType.SEMICOLON, "Esperava ';' após valor da propriedade");
                            
                            properties.push({
                                type: "Property",
                                name,
                                value
                            });
                        } else {
                            throw this.error(this.peek(), "Esperava ':' após nome da propriedade");
                        }
                    } else {
                        throw this.error(this.peek(), "Esperava nome da propriedade");
                    }
                }
                
                this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após propriedades do endpoint");
                
                endpoints.push({
                    type: "ApiEndpoint",
                    path,
                    properties
                });
            } else {
                throw this.error(this.peek(), "Esperava caminho da API como string");
            }
        }
        
        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após endpoints da API");
        
        return {
            type: "ApiDeclaration",
            endpoints
        };
    }

    private handlerDeclaration(): Node {
        this.consume(TokenType.LEFT_PAREN, "Esperava '(' após 'handler'");
        const params = this.parameters();
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após parâmetros");
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' antes do corpo do handler");
        
        // Skip the handler body for now
        let braceCount = 1;
        while (braceCount > 0 && !this.isAtEnd()) {
            if (this.match(TokenType.LEFT_BRACE)) {
                braceCount++;
            } else if (this.match(TokenType.RIGHT_BRACE)) {
                braceCount--;
            } else {
                this.advance();
            }
        }
        
        return {
            type: "HandlerDeclaration",
            params,
            body: {
                type: "Block",
                statements: []
            }
        };
    }

    private componentDeclaration(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do componente.");
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após nome do componente.");

        const body: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            if (this.match(TokenType.STATE)) {
                body.push(this.stateDeclaration());
            } else if (this.match(TokenType.FUNCTION)) {
                body.push(this.functionDeclaration());
            } else if (this.match(TokenType.RENDER)) {
                body.push(this.renderBlock());
            } else {
                throw this.error(this.peek(), "Declaração inválida dentro do componente.");
            }
        }

        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após corpo do componente.");

        return {
            type: "ComponentDeclaration",
            name: name.lexeme,
            body
        };
    }

    private stateDeclaration(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do estado.");
        this.consume(TokenType.COLON, "Esperava ':' após nome do estado.");
        const initialValue = this.expression();
        this.consume(TokenType.SEMICOLON, "Esperava ';' após declaração de estado.");

        return {
            type: "StateDeclaration",
            name: name.lexeme,
            initialValue
        };
    }

    private renderBlock(): Node {
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após 'render'.");
        
        const elements: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            elements.push(this.element());
        }

        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após bloco de renderização.");

        return {
            type: "RenderBlock",
            elements
        };
    }

    private element(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do elemento.");
        
        const attributes: Node[] = [];
        if (this.match(TokenType.LEFT_BRACE)) {
            while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
                attributes.push(this.attribute());
            }
            this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após atributos.");
        }

        return {
            type: "Element",
            name: name.lexeme,
            attributes
        };
    }

    private attribute(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome do atributo.");
        this.consume(TokenType.COLON, "Esperava ':' após nome do atributo.");
        const value = this.expression();

        return {
            type: "Attribute",
            name: name.lexeme,
            value
        };
    }

    private socketDeclaration(): Node {
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após 'socket'.");
        
        const handlers: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            // Ignorar comentários
            while (this.match(TokenType.COMMENT)) {
                // Não faz nada, apenas avança
            }

            if (this.check(TokenType.RIGHT_BRACE)) break;

            if (this.match(TokenType.ON)) {
                handlers.push(this.socketHandler());
            } else {
                throw this.error(this.peek(), "Esperava declaração de handler de socket.");
            }
        }

        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após handlers de socket.");

        return {
            type: "SocketDeclaration",
            handlers
        };
    }

    private socketHandler(): Node {
        this.consume(TokenType.LEFT_PAREN, "Esperava '(' após 'on'");
        const event = this.consume(TokenType.STRING, "Esperava nome do evento como string");
        this.consume(TokenType.COMMA, "Esperava ',' após nome do evento");
        const param = this.consume(TokenType.IDENTIFIER, "Esperava nome do parâmetro");
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após parâmetros");
        
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após declaração do socket");
        
        const body = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const stmt = this.statement();
            if (stmt) body.push(stmt);
        }
        
        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após corpo do socket");
        
        return {
            type: "SocketHandler",
            event: event.literal,
            parameter: param.lexeme,
            body: body
        };
    }

    private statement(): Node {
        if (this.match(TokenType.IF)) return this.ifStatement();
        if (this.match(TokenType.FOR)) return this.forStatement();
        if (this.match(TokenType.RETURN)) return this.returnStatement();
        if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
        
        return this.expressionStatement();
    }

    private expressionStatement(): Node {
        const expr = this.expression();
        // Ponto e vírgula é opcional
        this.match(TokenType.SEMICOLON);
        return {
            type: "ExpressionStatement",
            expression: expr
        };
    }

    private ifStatement(): Node {
        this.consume(TokenType.LEFT_PAREN, "Esperava '(' após 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após condição.");
        
        const thenBranch = this.statement();
        let elseBranch = null;
        
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }
        
        return {
            type: "IfStatement",
            condition,
            thenBranch,
            elseBranch
        };
    }

    private forStatement(): Node {
        this.consume(TokenType.LEFT_PAREN, "Esperava '(' após 'for'.");
        const item = this.consume(TokenType.IDENTIFIER, "Esperava nome do item.");
        this.consume(TokenType.IN, "Esperava 'in' após nome do item.");
        const collection = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após expressão.");
        
        const body = this.statement();
        
        return {
            type: "ForStatement",
            item: item.lexeme,
            collection,
            body
        };
    }

    private returnStatement(): Node {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Esperava ';' após valor de retorno.");
        
        return {
            type: "ReturnStatement",
            value
        };
    }

    private parameters(): string[] {
        const params: string[] = [];
        
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (this.match(TokenType.IDENTIFIER)) {
                    params.push(this.previous().lexeme);
                } else {
                    throw this.error(this.peek(), "Esperava nome do parâmetro");
                }
            } while (this.match(TokenType.COMMA));
        }

        return params;
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private error(token: Token, message: string): Error {
        return new Error(
            `Erro na linha ${token.line}: ${message}`
        );
    }

    private pageDeclaration(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome da página.");
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' após nome da página.");

        const body: Node[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            if (this.match(TokenType.STATE)) {
                body.push(this.stateDeclaration());
            } else if (this.match(TokenType.FUNCTION)) {
                body.push(this.functionDeclaration());
            } else if (this.match(TokenType.RENDER)) {
                body.push(this.renderBlock());
            } else {
                throw this.error(this.peek(), "Declaração inválida dentro da página.");
            }
        }

        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após corpo da página.");

        return {
            type: "PageDeclaration",
            name: name.lexeme,
            body
        };
    }

    private functionDeclaration(): Node {
        const name = this.consume(TokenType.IDENTIFIER, "Esperava nome da função.");
        this.consume(TokenType.LEFT_PAREN, "Esperava '(' após nome da função.");
        const params = this.parameters();
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após parâmetros.");
        this.consume(TokenType.LEFT_BRACE, "Esperava '{' antes do corpo da função.");
        const body = this.block();
        
        return {
            type: "FunctionDeclaration",
            name: name.lexeme,
            params,
            body
        };
    }

    private expression(): Node {
        if (this.match(TokenType.LEFT_BRACKET)) {
            const elements: Node[] = [];
            
            if (!this.check(TokenType.RIGHT_BRACKET)) {
                do {
                    if (this.match(TokenType.IDENTIFIER)) {
                        const name = this.previous().lexeme;
                        this.consume(TokenType.COLON, "Esperava ':' após nome da propriedade");
                        const value = this.expression();
                        elements.push({
                            type: "Property",
                            name,
                            value
                        });
                    } else {
                        elements.push(this.expression());
                    }
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_BRACKET, "Esperava ']' após elementos do array");
            
            return {
                type: "ArrayExpression",
                elements
            };
        }
        
        if (this.match(TokenType.LEFT_BRACE)) {
            const properties: Node[] = [];
            
            if (!this.check(TokenType.RIGHT_BRACE)) {
                do {
                    if (this.match(TokenType.IDENTIFIER)) {
                        const name = this.previous().lexeme;
                        this.consume(TokenType.COLON, "Esperava ':' após nome da propriedade");
                        const value = this.expression();
                        properties.push({
                            type: "Property",
                            name,
                            value
                        });
                    } else if (this.match(TokenType.STRING)) {
                        const name = this.previous().literal;
                        this.consume(TokenType.COLON, "Esperava ':' após nome da propriedade");
                        const value = this.expression();
                        properties.push({
                            type: "Property",
                            name,
                            value
                        });
                    } else {
                        throw this.error(this.peek(), "Esperava nome da propriedade");
                    }
                } while (this.match(TokenType.COMMA));
            }
            
            this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após propriedades do objeto");
            
            return {
                type: "ObjectExpression",
                properties
            };
        }
        
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após expressão");
            
            if (this.match(TokenType.ARROW)) {
                this.consume(TokenType.LEFT_BRACE, "Esperava '{' antes do corpo da função");
                const body = this.block();
                
                return {
                    type: "ArrowFunctionExpression",
                    params: [expr],
                    body
                };
            }
            
            return expr;
        }
        
        return this.member();
    }

    private member(): Node {
        let expr: Node = this.primary();
        
        while (true) {
            if (this.match(TokenType.DOT)) {
                const property = this.consume(TokenType.IDENTIFIER, "Esperava nome da propriedade após '.'");
                expr = {
                    type: "MemberExpression",
                    object: expr,
                    property: {
                        type: "Identifier",
                        name: property.lexeme
                    }
                };
            } else if (this.match(TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            } else {
                break;
            }
        }
        
        return expr;
    }

    private primary(): Node {
        if (this.match(TokenType.STRING)) {
            return {
                type: "StringLiteral",
                value: this.previous().literal
            };
        }
        
        if (this.match(TokenType.NUMBER)) {
            return {
                type: "NumberLiteral",
                value: this.previous().literal
            };
        }
        
        if (this.match(TokenType.TRUE)) {
            return {
                type: "BooleanLiteral",
                value: true
            };
        }
        
        if (this.match(TokenType.FALSE)) {
            return {
                type: "BooleanLiteral",
                value: false
            };
        }
        
        if (this.match(TokenType.IDENTIFIER)) {
            return {
                type: "Identifier",
                name: this.previous().lexeme
            };
        }
        
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após expressão");
            return expr;
        }
        
        throw this.error(this.peek(), "Esperava expressão");
    }

    private finishCall(callee: Node): Node {
        const args: Node[] = [];
        
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                args.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }
        
        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após argumentos");
        
        return {
            type: "CallExpression",
            callee,
            arguments: args
        };
    }

    private block(): Node {
        const statements: Node[] = [];
        
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            // Ignorar comentários
            while (this.match(TokenType.COMMENT)) {
                // Não faz nada, apenas avança
            }

            if (this.check(TokenType.RIGHT_BRACE)) break;

            if (this.match(TokenType.IDENTIFIER)) {
                const identifier = this.previous();
                
                if (this.match(TokenType.LEFT_PAREN)) {
                    // Pode ser uma declaração de função ou uma chamada de função
                    const start = this.current;
                    let isFunction = false;
                    
                    // Olhar à frente para ver se é uma declaração de função
                    while (!this.check(TokenType.RIGHT_PAREN) && !this.isAtEnd()) {
                        if (this.match(TokenType.IDENTIFIER)) {
                            // Continua procurando
                        } else {
                            // Se encontrar algo que não é um identificador, não é uma declaração de função
                            break;
                        }
                        
                        if (this.match(TokenType.COMMA)) {
                            // Continua procurando
                        }
                    }
                    
                    if (this.match(TokenType.RIGHT_PAREN)) {
                        isFunction = this.check(TokenType.LEFT_BRACE);
                    }
                    
                    // Voltar para o início dos parâmetros
                    this.current = start;
                    
                    if (isFunction) {
                        // É uma declaração de função
                        const params = this.parameters();
                        this.consume(TokenType.RIGHT_PAREN, "Esperava ')' após parâmetros");
                        this.consume(TokenType.LEFT_BRACE, "Esperava '{' antes do corpo da função");
                        const body = this.block();
                        
                        statements.push({
                            type: "Property",
                            name: identifier.lexeme,
                            value: {
                                type: "FunctionExpression",
                                params,
                                body
                            }
                        });
                    } else {
                        // É uma chamada de função
                        this.current--; // Voltar para o parêntese esquerdo
                        const expr = this.expression();
                        // Ponto e vírgula é opcional
                        this.match(TokenType.SEMICOLON);
                        statements.push({
                            type: "ExpressionStatement",
                            expression: expr
                        });
                    }
                } else if (this.match(TokenType.COLON)) {
                    // Property declaration
                    let value: Node;
                    if (this.match(TokenType.LEFT_BRACE)) {
                        value = this.block();
                    } else {
                        value = this.expression();
                        // Ponto e vírgula é opcional
                        this.match(TokenType.SEMICOLON);
                    }
                    
                    statements.push({
                        type: "Property",
                        name: identifier.lexeme,
                        value
                    });
                } else if (this.match(TokenType.LEFT_BRACE)) {
                    // Block without colon
                    const value = this.block();
                    statements.push({
                        type: "Property",
                        name: identifier.lexeme,
                        value
                    });
                } else {
                    // Regular expression
                    this.current--; // Go back to identifier
                    const expr = this.expression();
                    // Ponto e vírgula é opcional
                    this.match(TokenType.SEMICOLON);
                    statements.push({
                        type: "ExpressionStatement",
                        expression: expr
                    });
                }
            } else if (this.match(TokenType.STRING)) {
                const string = this.previous();
                
                if (this.match(TokenType.COLON)) {
                    // Property with string key
                    let value: Node;
                    if (this.match(TokenType.LEFT_BRACE)) {
                        value = this.block();
                    } else {
                        value = this.expression();
                        // Ponto e vírgula é opcional
                        this.match(TokenType.SEMICOLON);
                    }
                    
                    statements.push({
                        type: "Property",
                        name: string.literal,
                        value
                    });
                } else {
                    // Regular string expression
                    this.current--; // Go back to string
                    const expr = this.expression();
                    // Ponto e vírgula é opcional
                    this.match(TokenType.SEMICOLON);
                    statements.push({
                        type: "ExpressionStatement",
                        expression: expr
                    });
                }
            } else {
                const stmt = this.statement();
                if (stmt) statements.push(stmt);
            }
        }
        
        this.consume(TokenType.RIGHT_BRACE, "Esperava '}' após bloco");
        
        return {
            type: "Block",
            statements
        };
    }
} 