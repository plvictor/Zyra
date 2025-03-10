#include "lexer.hpp"
#include "interpreter.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <filesystem>

std::string readFile(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) {
        throw std::runtime_error("Não foi possível abrir o arquivo: " + path);
    }
    
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

std::string tokenTypeToString(zyra::TokenType type) {
    switch (type) {
        case zyra::TokenType::COMPONENT: return "COMPONENT";
        case zyra::TokenType::STATE: return "STATE";
        case zyra::TokenType::STYLE: return "STYLE";
        case zyra::TokenType::INTERFACE: return "INTERFACE";
        case zyra::TokenType::EVENTOS: return "EVENTOS";
        case zyra::TokenType::IF: return "IF";
        case zyra::TokenType::ELSE: return "ELSE";
        case zyra::TokenType::IDENTIFIER: return "IDENTIFIER";
        case zyra::TokenType::STRING: return "STRING";
        case zyra::TokenType::NUMBER: return "NUMBER";
        case zyra::TokenType::COLOR: return "COLOR";
        case zyra::TokenType::UNIT: return "UNIT";
        case zyra::TokenType::LEFT_BRACE: return "LEFT_BRACE";
        case zyra::TokenType::RIGHT_BRACE: return "RIGHT_BRACE";
        case zyra::TokenType::LEFT_PAREN: return "LEFT_PAREN";
        case zyra::TokenType::RIGHT_PAREN: return "RIGHT_PAREN";
        case zyra::TokenType::EQUALS: return "EQUALS";
        case zyra::TokenType::PLUS_EQUALS: return "PLUS_EQUALS";
        case zyra::TokenType::MINUS_EQUALS: return "MINUS_EQUALS";
        case zyra::TokenType::BANG: return "BANG";
        case zyra::TokenType::COLON: return "COLON";
        case zyra::TokenType::ARROW: return "ARROW";
        case zyra::TokenType::DOT: return "DOT";
        case zyra::TokenType::COMMA: return "COMMA";
        case zyra::TokenType::EOF_TOKEN: return "EOF";
        default: return "UNKNOWN";
    }
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Uso: " << argv[0] << " <arquivo.zy>" << std::endl;
        return 1;
    }
    
    try {
        // Lê o arquivo fonte
        std::string source = readFile(argv[1]);
        
        // Cria o lexer e gera os tokens
        zyra::Lexer lexer(source);
        auto tokens = lexer.scanTokens();
        
        // Cria o interpretador e gera os arquivos
        zyra::Interpreter interpreter(tokens);
        
        // Cria o diretório dist se não existir
        std::filesystem::create_directories("dist");
        
        // Gera os arquivos HTML/JS
        interpreter.generate("dist");
        
        std::cout << "Site gerado com sucesso na pasta 'dist'!" << std::endl;
        std::cout << "Para visualizar, abra o arquivo dist/index.html no navegador." << std::endl;
        
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Erro: " << e.what() << std::endl;
        return 1;
    }
} 