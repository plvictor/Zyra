#include "lexer.hpp"
#include <stdexcept>
#include <unordered_map>
#include <unordered_set>

namespace zyra {

// Mapa de palavras-chave
static std::unordered_map<std::string, TokenType> keywords = {
    {"component", TokenType::COMPONENT},
    {"state", TokenType::STATE},
    {"style", TokenType::STYLE},
    {"interface", TokenType::INTERFACE},
    {"eventos", TokenType::EVENTOS},
    {"if", TokenType::IF},
    {"else", TokenType::ELSE}
};

// Conjunto de unidades válidas
static std::unordered_set<std::string> units = {
    "%", "px", "rem", "em", "vh", "vw", "s", "ms"
};

Lexer::Lexer(std::string source) : source(std::move(source)) {}

std::vector<Token> Lexer::scanTokens() {
    while (!isAtEnd()) {
        start = current;
        scanToken();
    }
    
    tokens.emplace_back(TokenType::EOF_TOKEN, "", line);
    return tokens;
}

void Lexer::scanToken() {
    char c = advance();
    switch (c) {
        case '{': addToken(TokenType::LEFT_BRACE); break;
        case '}': addToken(TokenType::RIGHT_BRACE); break;
        case '(': addToken(TokenType::LEFT_PAREN); break;
        case ')': addToken(TokenType::RIGHT_PAREN); break;
        case '=': 
            if (match('>')) {
                addToken(TokenType::ARROW);
            } else {
                addToken(TokenType::EQUALS);
            }
            break;
        case '+':
            if (match('=')) {
                addToken(TokenType::PLUS_EQUALS);
            } else {
                throw std::runtime_error("Caractere inesperado '+' na linha " + std::to_string(line));
            }
            break;
        case '-':
            if (match('>')) {
                addToken(TokenType::ARROW);
            } else if (match('=')) {
                addToken(TokenType::MINUS_EQUALS);
            } else if (isDigit(peek())) {
                number();
            } else if (isAlpha(peek()) || peek() == '_') {
                current--; // Volta para incluir o hífen
                identifier();
            } else {
                throw std::runtime_error("Caractere inesperado '-' na linha " + std::to_string(line));
            }
            break;
        case '!': addToken(TokenType::BANG); break;
        case ':': addToken(TokenType::COLON); break;
        case '.': addToken(TokenType::DOT); break;
        case ',': addToken(TokenType::COMMA); break;
        case '#': color(); break;
        case '"': string(); break;
        case '%': addToken(TokenType::UNIT, "%"); break;
        
        // Comentários
        case '/':
            if (match('/')) {
                // Comentário de linha única
                while (peek() != '\n' && !isAtEnd()) advance();
            } else {
                throw std::runtime_error("Caractere inesperado '/' na linha " + std::to_string(line));
            }
            break;
            
        // Ignora espaços em branco
        case ' ':
        case '\r':
        case '\t':
            break;
        case '\n':
            line++;
            break;
            
        default:
            if (isDigit(c)) {
                number();
            } else if (isAlpha(c) || c == '_') {
                identifier();
            } else {
                throw std::runtime_error("Caractere inesperado '" + std::string(1, c) + "' na linha " + std::to_string(line));
            }
            break;
    }
}

void Lexer::string() {
    while (peek() != '"' && !isAtEnd()) {
        if (peek() == '\n') line++;
        advance();
    }
    
    if (isAtEnd()) {
        throw std::runtime_error("String não terminada na linha " + std::to_string(line));
    }
    
    advance(); // Consome as aspas finais
    
    std::string value = source.substr(start + 1, current - start - 2);
    addToken(TokenType::STRING, value);
}

void Lexer::number() {
    while (isDigit(peek())) advance();
    
    if (peek() == '.' && isDigit(peekNext())) {
        advance();
        while (isDigit(peek())) advance();
    }
    
    // Verifica se há uma unidade após o número
    if (peek() == '%') {
        std::string num = source.substr(start, current - start);
        advance(); // Consome o %
        addToken(TokenType::UNIT, num + "%");
        return;
    }
    
    if (isAlpha(peek())) {
        std::string num = source.substr(start, current - start);
        std::string unit;
        while (isAlpha(peek())) {
            unit += advance();
        }
        if (units.find(unit) != units.end()) {
            addToken(TokenType::UNIT, num + unit);
            return;
        }
        // Se não for uma unidade válida, volta atrás
        current -= unit.length();
    }
    
    addToken(TokenType::NUMBER, source.substr(start, current - start));
}

void Lexer::identifier() {
    while (isAlphaNumeric(peek()) || peek() == '-' || peek() == '_') advance();
    
    std::string text = source.substr(start, current - start);
    auto it = keywords.find(text);
    TokenType type = it != keywords.end() ? it->second : TokenType::IDENTIFIER;
    
    addToken(type);
}

void Lexer::color() {
    while (isDigit(peek()) || (peek() >= 'a' && peek() <= 'f') || (peek() >= 'A' && peek() <= 'F')) {
        advance();
    }
    
    addToken(TokenType::COLOR);
}

bool Lexer::isAtEnd() {
    return current >= source.length();
}

char Lexer::advance() {
    return source[current++];
}

bool Lexer::match(char expected) {
    if (isAtEnd() || source[current] != expected) return false;
    current++;
    return true;
}

char Lexer::peek() {
    if (isAtEnd()) return '\0';
    return source[current];
}

char Lexer::peekNext() {
    if (current + 1 >= source.length()) return '\0';
    return source[current + 1];
}

void Lexer::addToken(TokenType type) {
    addToken(type, source.substr(start, current - start));
}

void Lexer::addToken(TokenType type, std::string lexeme) {
    tokens.emplace_back(type, std::move(lexeme), line);
}

bool Lexer::isDigit(char c) {
    return c >= '0' && c <= '9';
}

bool Lexer::isAlpha(char c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c == '_';
}

bool Lexer::isAlphaNumeric(char c) {
    return isAlpha(c) || isDigit(c);
}

} // namespace zyra 