// Tipos de tokens da linguagem Zyra
export enum TokenType {
    // Palavras-chave
    IMPORT = 'IMPORT',
    AS = 'AS',
    FROM = 'FROM',
    APP = 'APP',
    SERVER = 'SERVER',
    COMPONENT = 'COMPONENT',
    PAGE = 'PAGE',
    STATE = 'STATE',
    FUNCTION = 'FUNCTION',
    RENDER = 'RENDER',
    IF = 'IF',
    ELSE = 'ELSE',
    FOR = 'FOR',
    IN = 'IN',
    SOCKET = 'SOCKET',
    EMIT = 'EMIT',
    ON = 'ON',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    RETURN = 'RETURN',
    
    // Símbolos
    LEFT_BRACE = '{',
    RIGHT_BRACE = '}',
    LEFT_PAREN = '(',
    RIGHT_PAREN = ')',
    LEFT_BRACKET = '[',
    RIGHT_BRACKET = ']',
    COLON = ':',
    SEMICOLON = ';',
    COMMA = ',',
    ARROW = '=>',
    DOT = '.',
    
    // Outros
    COMMENT = 'COMMENT',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    IDENTIFIER = 'IDENTIFIER',
    EOF = 'EOF'
}

export interface Token {
    type: TokenType;
    lexeme: string;
    literal: any;
    line: number;
}

export class Lexer {
    private source: string;
    private tokens: Token[] = [];
    private start = 0;
    private current = 0;
    private line = 1;
    
    private keywords: { [key: string]: TokenType } = {
        'import': TokenType.IMPORT,
        'as': TokenType.AS,
        'from': TokenType.FROM,
        'app': TokenType.APP,
        'server': TokenType.SERVER,
        'component': TokenType.COMPONENT,
        'page': TokenType.PAGE,
        'state': TokenType.STATE,
        'function': TokenType.FUNCTION,
        'render': TokenType.RENDER,
        'if': TokenType.IF,
        'else': TokenType.ELSE,
        'for': TokenType.FOR,
        'in': TokenType.IN,
        'socket': TokenType.SOCKET,
        'emit': TokenType.EMIT,
        'on': TokenType.ON,
        'true': TokenType.TRUE,
        'false': TokenType.FALSE,
        'return': TokenType.RETURN
    };

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push({
            type: TokenType.EOF,
            lexeme: "",
            literal: null,
            line: this.line
        });

        return this.tokens;
    }

    private scanToken() {
        const c = this.advance();
        
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case '[': this.addToken(TokenType.LEFT_BRACKET); break;
            case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
            case ':': this.addToken(TokenType.COLON); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '=': 
                if (this.match('>')) {
                    this.addToken(TokenType.ARROW);
                }
                break;
            case '/':
                if (this.match('/')) {
                    // Comentário de linha única
                    let comment = '';
                    while (this.peek() != '\n' && !this.isAtEnd()) {
                        comment += this.advance();
                    }
                    this.addToken(TokenType.COMMENT, comment.trim());
                } else if (this.match('*')) {
                    // Comentário multilinhas
                    let comment = '';
                    while (!this.isAtEnd()) {
                        if (this.peek() == '*' && this.peekNext() == '/') {
                            this.advance(); // Consome *
                            this.advance(); // Consome /
                            break;
                        }
                        if (this.peek() == '\n') {
                            this.line++;
                            comment += '\n';
                        } else {
                            comment += this.advance();
                        }
                    }
                    this.addToken(TokenType.COMMENT, comment.trim());
                } else {
                    throw this.error(`Caractere inesperado '${c}'`);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignora espaços em branco
                break;
            case '\n':
                this.line++;
                break;
            case '"': this.string(); break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    throw this.error(`Caractere inesperado '${c}'`);
                }
                break;
        }
    }

    private string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            throw new Error(`String não terminada na linha ${this.line}`);
        }

        this.advance();

        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    private number() {
        while (this.isDigit(this.peek())) this.advance();

        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) this.advance();
        }

        this.addToken(
            TokenType.NUMBER,
            parseFloat(this.source.substring(this.start, this.current))
        );
    }

    private identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);
        const type = this.keywords[text] || TokenType.IDENTIFIER;
        this.addToken(type);
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private addToken(type: TokenType, literal: any = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            lexeme: text,
            literal,
            line: this.line
        });
    }

    private match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;

        this.current++;
        return true;
    }

    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               c === '_';
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private error(message: string): Error {
        return new Error(`${message} na linha ${this.line}`);
    }
} 