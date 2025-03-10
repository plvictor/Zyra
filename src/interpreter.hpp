#ifndef ZYRA_INTERPRETER_H
#define ZYRA_INTERPRETER_H

#include "lexer.hpp"
#include <string>
#include <vector>
#include <memory>

namespace zyra {

// Classes para representar a AST (Árvore Sintática Abstrata)
class Node {
public:
    virtual ~Node() = default;
    virtual std::string generateHTML() = 0;
    virtual std::string generateJS() = 0;
};

// Elemento da interface
class Element : public Node {
public:
    std::string html;
    
    explicit Element(std::string h) : html(std::move(h)) {}
    
    std::string generateHTML() override { return html; }
    std::string generateJS() override { return ""; }
};

// Componente
class Component : public Node {
public:
    std::string name;
    std::vector<std::unique_ptr<Node>> children;
    
    Component(std::string n) : name(std::move(n)) {}
    
    std::string generateHTML() override;
    std::string generateJS() override;
};

// Estado
class State : public Node {
public:
    std::vector<std::pair<std::string, std::string>> variables;
    
    std::string generateHTML() override;
    std::string generateJS() override;
};

// Estilo
class Style : public Node {
public:
    std::vector<std::pair<std::string, std::string>> properties;
    
    std::string generateHTML() override;
    std::string generateJS() override;
};

// Interface (elementos visuais)
class Interface : public Node {
public:
    std::vector<std::unique_ptr<Node>> elements;
    
    std::string generateHTML() override;
    std::string generateJS() override;
};

// Eventos
class Event : public Node {
public:
    std::string name;
    std::string code;
    
    Event(std::string n, std::string c) 
        : name(std::move(n)), code(std::move(c)) {}
    
    std::string generateHTML() override;
    std::string generateJS() override;
};

// Classe principal do interpretador
class Interpreter {
public:
    explicit Interpreter(std::vector<Token> tokens);
    
    // Gera os arquivos finais
    void generate(const std::string& outputDir);

private:
    std::vector<Token> tokens;
    int current = 0;
    
    // Métodos auxiliares para parsing
    std::unique_ptr<Component> parseComponent();
    std::unique_ptr<State> parseState();
    std::unique_ptr<Style> parseStyle();
    std::unique_ptr<Interface> parseInterface();
    std::unique_ptr<Event> parseEvent();
    
    // Métodos auxiliares para consumir tokens
    Token advance();
    Token peek();
    Token previous();
    bool match(TokenType type);
    Token consume(TokenType type, const std::string& message);
    bool check(TokenType type);
    bool isAtEnd();
};

} // namespace zyra

#endif 