#ifndef ZYRA_LEXER_H
#define ZYRA_LEXER_H

#include <string>
#include <vector>

namespace zyra {

// Define os tipos de tokens da linguagem
enum class TokenType {
    // Palavras-chave
    COMPONENT,
    STATE,
    STYLE,
    INTERFACE,
    EVENTOS,
    IF,
    ELSE,
    
    // Literais
    IDENTIFIER,    // Identificadores (nomes de variáveis, funções, etc)
    STRING,        // Strings entre aspas
    NUMBER,        // Números
    COLOR,         // Cores hexadecimais
    UNIT,          // Unidades (%, px, rem, etc)
    
    // Símbolos
    LEFT_BRACE,    // {
    RIGHT_BRACE,   // }
    LEFT_PAREN,    // (
    RIGHT_PAREN,   // )
    EQUALS,        // =
    PLUS_EQUALS,   // +=
    MINUS_EQUALS,  // -=
    BANG,          // !
    COLON,         // :
    ARROW,         // ->
    DOT,           // .
    COMMA,         // ,
    
    // Final de arquivo
    EOF_TOKEN
};

// Estrutura para representar um token
struct Token {
    TokenType type;
    std::string lexeme;  // O texto do token
    int line;           // Linha onde o token aparece
    
    Token(TokenType t, std::string l, int ln) 
        : type(t), lexeme(std::move(l)), line(ln) {}
};

// Classe do analisador léxico
class Lexer {
public:
    explicit Lexer(std::string source);
    std::vector<Token> scanTokens();

private:
    std::string source;
    std::vector<Token> tokens;
    int start = 0;      // Início do token atual
    int current = 0;    // Caractere atual
    int line = 1;       // Linha atual
    
    bool isAtEnd();
    void scanToken();
    char advance();
    void addToken(TokenType type);
    void addToken(TokenType type, std::string lexeme);
    bool match(char expected);
    char peek();
    char peekNext();
    
    void string();      // Processa strings
    void number();      // Processa números
    void identifier();  // Processa identificadores
    void color();       // Processa cores
    void unit();        // Processa unidades
    
    static bool isDigit(char c);
    static bool isAlpha(char c);
    static bool isAlphaNumeric(char c);
};

} // namespace zyra

#endif 