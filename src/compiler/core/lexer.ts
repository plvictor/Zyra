// Tipos de tokens da linguagem Zyra
export enum TokenType {
    // Palavras-chave
    IMPORT = "IMPORT",
    FROM = "FROM",
    AS = "AS",
    APP = "APP",
    SERVER = "SERVER",
    SOCKET = "SOCKET",
    ON = "ON",
    COMPONENT = "COMPONENT",
    PAGE = "PAGE",
    STATE = "STATE",
    FUNCTION = "FUNCTION",
    RENDER = "RENDER",
    IF = "IF",
    ELSE = "ELSE",
    FOR = "FOR",
    IN = "IN",
    RETURN = "RETURN",
    TRUE = "TRUE",
    FALSE = "FALSE",
    EXPORT = "EXPORT",

    // Identificadores e literais
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",
    COMMENT = "COMMENT",
    COLOR = "COLOR",
    UNIT = "UNIT",
    NULL = "NULL",

    // Símbolos
    LEFT_BRACE = "LEFT_BRACE",         // {
    RIGHT_BRACE = "RIGHT_BRACE",       // }
    LEFT_PAREN = "LEFT_PAREN",         // (
    RIGHT_PAREN = "RIGHT_PAREN",       // )
    LEFT_BRACKET = "LEFT_BRACKET",     // [
    RIGHT_BRACKET = "RIGHT_BRACKET",   // ]
    COMMA = "COMMA",                   // ,
    DOT = "DOT",                       // .
    SEMICOLON = "SEMICOLON",           // ;
    COLON = "COLON",                   // :
    ARROW = "ARROW",                   // =>

    // Final de arquivo
    EOF = "EOF",

    // Comparação
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER = "GREATER",
    LESS = "LESS",
    GREATER_EQUAL = "GREATER_EQUAL",
    LESS_EQUAL = "LESS_EQUAL",

    // Operadores
    EQUAL = "EQUAL",
    PLUS = "PLUS",
    MINUS = "MINUS",
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    NOT = "NOT"
}

export class Token {
    constructor(
        public type: TokenType,
        public lexeme: string,
        public literal: any,
        public line: number
    ) {}

    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}

export class Lexer {
    private source: string;
    private tokens: Token[] = [];
    private start = 0;
    private current = 0;
    private line = 1;

    private keywords: { [key: string]: TokenType } = {
        "import": TokenType.IMPORT,
        "from": TokenType.FROM,
        "as": TokenType.AS,
        "app": TokenType.APP,
        "server": TokenType.SERVER,
        "socket": TokenType.SOCKET,
        "on": TokenType.ON,
        "component": TokenType.COMPONENT,
        "page": TokenType.PAGE,
        "state": TokenType.STATE,
        "function": TokenType.FUNCTION,
        "render": TokenType.RENDER,
        "if": TokenType.IF,
        "else": TokenType.ELSE,
        "for": TokenType.FOR,
        "in": TokenType.IN,
        "return": TokenType.RETURN,
        "true": TokenType.TRUE,
        "false": TokenType.FALSE,
        "export": TokenType.EXPORT,
        "null": TokenType.NULL
    };

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }

    private scanToken() {
        const c = this.advance();
        switch (c) {
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '[': this.addToken(TokenType.LEFT_BRACKET); break;
            case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': 
                if (this.match('>')) {
                    this.addToken(TokenType.ARROW);
                } else {
                    this.addToken(TokenType.MINUS);
                }
                break;
            case '+': this.addToken(TokenType.PLUS); break;
            case '*': this.addToken(TokenType.MULTIPLY); break;
            case ':': this.addToken(TokenType.COLON); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;

            case '!': 
                this.addToken(this.match('=') ? TokenType.NOT_EQUALS : TokenType.NOT);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUALS : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;

            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;

            case '"': this.string(); break;
            case '#': this.color(); break;

            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    throw new Error(`Caractere inesperado '${c}' na linha ${this.line}`);
                }
                break;
        }
    }

    private string() {
        const quote = this.source[this.current - 1]; // ' ou "
        while (this.peek() !== quote && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            throw new Error(`String não terminada na linha ${this.line}`);
        }

        // Consumir a aspas de fechamento
        this.advance();

        // Pegar o valor da string sem as aspas
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    private color() {
        while (this.isHexDigit(this.peek())) this.advance();

        const hex = this.source.substring(this.start + 1, this.current);
        if (hex.length !== 6) {
            throw new Error(`Invalid color format at line ${this.line}`);
        }

        this.addToken(TokenType.COLOR, hex);
    }

    private number() {
        while (this.isDigit(this.peek())) this.advance();

        // Parte decimal
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance(); // Consumir o '.'
            while (this.isDigit(this.peek())) this.advance();
        }

        // Check for units
        if (this.isAlpha(this.peek())) {
            const start = this.current;
            while (this.isAlpha(this.peek())) this.advance();
            const unit = this.source.substring(start, this.current);
            
            if (['px', 'em', 'rem', '%', 'vh', 'vw'].includes(unit)) {
                this.addToken(TokenType.UNIT, {
                    value: parseFloat(this.source.substring(this.start, start)),
                    unit: unit
                });
                return;
            }
        }

        const value = parseFloat(this.source.substring(this.start, this.current));
        this.addToken(TokenType.NUMBER, value);
    }

    private identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);
        const type = this.keywords[text] || TokenType.IDENTIFIER;
        this.addToken(type);
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

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               c === '_';
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    private isHexDigit(c: string): boolean {
        return this.isDigit(c) ||
               (c >= 'a' && c <= 'f') ||
               (c >= 'A' && c <= 'F');
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private addToken(type: TokenType, literal: any = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
} 