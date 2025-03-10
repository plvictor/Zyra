#include "interpreter.hpp"
#include <fstream>
#include <sstream>
#include <filesystem>

namespace zyra {

// Implementação dos métodos de Component
std::string Component::generateHTML() {
    std::stringstream html;
    html << "<div class=\"component " << name << "\" id=\"" << name << "\">\n";
    
    for (const auto& child : children) {
        html << child->generateHTML();
    }
    
    html << "</div>\n";
    return html.str();
}

std::string Component::generateJS() {
    std::stringstream js;
    js << "class " << name << " {\n";
    js << "  constructor() {\n";
    js << "    this.init();\n";
    js << "    this.setupEvents();\n";
    js << "  }\n\n";
    
    // Adiciona o método setupEvents
    js << "  setupEvents() {\n";
    js << "    // Configura os eventos dos botões\n";
    js << "    const buttons = document.querySelectorAll('button');\n";
    js << "    buttons.forEach(button => {\n";
    js << "      const action = button.getAttribute('data-action');\n";
    js << "      if (action && typeof this[action] === 'function') {\n";
    js << "        button.onclick = () => this[action]();\n";
    js << "      }\n";
    js << "    });\n";
    js << "  }\n\n";
    
    // Adiciona o método updateView
    js << "  updateView() {\n";
    js << "    // Atualiza o texto dos elementos\n";
    js << "    const elements = document.querySelectorAll('[data-bind]');\n";
    js << "    elements.forEach(element => {\n";
    js << "      const binding = element.getAttribute('data-bind');\n";
    js << "      if (binding && this[binding] !== undefined) {\n";
    js << "        element.textContent = this[binding];\n";
    js << "      }\n";
    js << "    });\n";
    js << "  }\n\n";
    
    for (const auto& child : children) {
        js << child->generateJS();
    }
    
    js << "}\n\n";
    js << "// Inicializa o componente\n";
    js << "new " << name << "();\n";
    return js.str();
}

// Implementação dos métodos de State
std::string State::generateHTML() {
    return ""; // Estado não gera HTML
}

std::string State::generateJS() {
    std::stringstream js;
    js << "  init() {\n";
    
    for (const auto& var : variables) {
        js << "    this." << var.first << " = ";
        
        // Se o valor começa com aspas, é uma string
        if (var.second[0] == '"') {
            js << var.second;
        } else if (var.second == "true" || var.second == "false") {
            js << var.second;
        } else if (isdigit(var.second[0]) || var.second[0] == '-') {
            js << var.second;
        } else {
            // Se não é string, booleano ou número, é um identificador
            js << "\"" << var.second << "\"";
        }
        js << ";\n";
    }
    
    js << "    this.updateView();\n";
    js << "  }\n\n";
    return js.str();
}

// Implementação dos métodos de Style
std::string Style::generateHTML() {
    std::stringstream css;
    css << "<style>\n";
    css << "." << "component {\n";
    
    for (const auto& prop : properties) {
        // Converte as propriedades para CSS válido
        std::string cssName = prop.first;
        std::string cssValue = prop.second;
        
        if (cssName == "cor") cssName = "color";
        else if (cssName == "fundo") cssName = "background-color";
        else if (cssName == "tamanho") cssName = "font-size";
        
        css << "  " << cssName << ": " << cssValue << ";\n";
    }
    
    css << "}\n";
    
    // Adiciona alguns estilos básicos
    css << "\n/* Estilos básicos */\n";
    css << "button {\n";
    css << "  padding: 10px 20px;\n";
    css << "  border: none;\n";
    css << "  border-radius: 5px;\n";
    css << "  cursor: pointer;\n";
    css << "  margin: 5px;\n";
    css << "}\n";
    
    css << "</style>\n";
    return css.str();
}

std::string Style::generateJS() {
    return ""; // Estilo não gera JavaScript
}

// Implementação dos métodos de Interface
std::string Interface::generateHTML() {
    std::stringstream html;
    
    for (const auto& element : elements) {
        html << element->generateHTML();
    }
    
    return html.str();
}

std::string Interface::generateJS() {
    std::stringstream js;
    
    for (const auto& element : elements) {
        js << element->generateJS();
    }
    
    return js.str();
}

// Implementação dos métodos de Event
std::string Event::generateHTML() {
    return ""; // Eventos não geram HTML diretamente
}

std::string Event::generateJS() {
    std::stringstream js;
    js << "  " << name << "() {\n";
    js << "    " << code << "\n";
    js << "    this.updateView();\n";  // Atualiza a view após o evento
    js << "  }\n\n";
    return js.str();
}

// Implementação do Interpretador
Interpreter::Interpreter(std::vector<Token> tokens) : tokens(std::move(tokens)) {}

void Interpreter::generate(const std::string& outputDir) {
    // Cria o diretório de saída se não existir
    std::filesystem::create_directories(outputDir);
    
    // Gera o HTML
    std::ofstream htmlFile(outputDir + "/index.html");
    htmlFile << "<!DOCTYPE html>\n";
    htmlFile << "<html>\n<head>\n";
    htmlFile << "<meta charset=\"UTF-8\">\n";
    htmlFile << "<title>Site Zyra</title>\n";
    
    // Processa os componentes
    std::stringstream components;
    std::stringstream scripts;
    
    while (!isAtEnd()) {
        if (match(TokenType::COMPONENT)) {
            auto component = parseComponent();
            components << component->generateHTML();
            
            // Gera o JavaScript do componente
            std::string jsFilename = component->name + ".js";
            std::ofstream jsFile(outputDir + "/" + jsFilename);
            jsFile << component->generateJS();
            jsFile.close();
            
            // Adiciona o script ao HTML
            scripts << "<script src=\"" << jsFilename << "\"></script>\n";
        } else {
            advance(); // Pula tokens desconhecidos
        }
    }
    
    htmlFile << "</head>\n<body>\n";
    htmlFile << components.str();
    htmlFile << scripts.str();
    htmlFile << "</body>\n</html>";
    htmlFile.close();
}

// Métodos auxiliares de parsing
std::unique_ptr<Component> Interpreter::parseComponent() {
    Token name = consume(TokenType::IDENTIFIER, "Esperado nome do componente");
    consume(TokenType::LEFT_BRACE, "Esperado '{' após nome do componente");
    
    auto component = std::make_unique<Component>(name.lexeme);
    
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        if (match(TokenType::STATE)) {
            component->children.push_back(parseState());
        } else if (match(TokenType::STYLE)) {
            component->children.push_back(parseStyle());
        } else if (match(TokenType::INTERFACE)) {
            component->children.push_back(parseInterface());
        } else if (match(TokenType::EVENTOS)) {
            component->children.push_back(parseEvent());
        } else {
            advance(); // Pula tokens desconhecidos
        }
    }
    
    consume(TokenType::RIGHT_BRACE, "Esperado '}' após corpo do componente");
    return component;
}

std::unique_ptr<State> Interpreter::parseState() {
    consume(TokenType::LEFT_BRACE, "Esperado '{' após 'state'");
    auto state = std::make_unique<State>();
    
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        Token name = consume(TokenType::IDENTIFIER, "Esperado nome da variável");
        consume(TokenType::COLON, "Esperado ':' após nome da variável");
        Token value = advance(); // Pode ser STRING, NUMBER, etc.
        
        state->variables.emplace_back(name.lexeme, value.lexeme);
    }
    
    consume(TokenType::RIGHT_BRACE, "Esperado '}' após declarações de estado");
    return state;
}

std::unique_ptr<Style> Interpreter::parseStyle() {
    consume(TokenType::LEFT_BRACE, "Esperado '{' após 'style'");
    auto style = std::make_unique<Style>();
    
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        Token prop = consume(TokenType::IDENTIFIER, "Esperado nome da propriedade");
        consume(TokenType::COLON, "Esperado ':' após nome da propriedade");
        Token value = advance(); // Pode ser COLOR, UNIT, etc.
        
        style->properties.emplace_back(prop.lexeme, value.lexeme);
    }
    
    consume(TokenType::RIGHT_BRACE, "Esperado '}' após declarações de estilo");
    return style;
}

std::unique_ptr<Interface> Interpreter::parseInterface() {
    consume(TokenType::LEFT_BRACE, "Esperado '{' após 'interface'");
    auto interface = std::make_unique<Interface>();
    
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        Token element = consume(TokenType::IDENTIFIER, "Esperado nome do elemento");
        consume(TokenType::LEFT_BRACE, "Esperado '{' após nome do elemento");
        
        // Processa as propriedades do elemento
        std::stringstream html;
        std::string tag = element.lexeme == "Botao" ? "button" : "div";
        html << "<" << tag << " class=\"" << element.lexeme << "\"";
        
        std::string texto;
        std::string acao;
        
        while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
            Token prop = consume(TokenType::IDENTIFIER, "Esperado nome da propriedade");
            consume(TokenType::COLON, "Esperado ':' após nome da propriedade");
            Token value = advance(); // Pode ser STRING, IDENTIFIER, etc.
            
            if (prop.lexeme == "texto") {
                texto = value.lexeme;
                if (value.type == TokenType::IDENTIFIER) {
                    html << " data-bind=\"" << value.lexeme << "\"";
                }
            } else if (prop.lexeme == "acao") {
                acao = value.lexeme;
                html << " data-action=\"" << value.lexeme << "\"";
            }
        }
        
        html << ">";
        
        // Adiciona o texto
        if (!texto.empty()) {
            if (texto[0] == '"') {
                // Remove as aspas
                texto = texto.substr(1, texto.length() - 2);
            }
            html << texto;
        }
        
        html << "</" << tag << ">\n";
        interface->elements.push_back(std::make_unique<Element>(html.str()));
        
        consume(TokenType::RIGHT_BRACE, "Esperado '}' após elemento");
    }
    
    consume(TokenType::RIGHT_BRACE, "Esperado '}' após interface");
    return interface;
}

std::unique_ptr<Event> Interpreter::parseEvent() {
    consume(TokenType::LEFT_BRACE, "Esperado '{' após 'eventos'");
    
    std::vector<std::unique_ptr<Event>> events;
    
    while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
        Token name = consume(TokenType::IDENTIFIER, "Esperado nome do evento");
        consume(TokenType::ARROW, "Esperado '->' após nome do evento");
        consume(TokenType::LEFT_BRACE, "Esperado '{' após '->'");
        
        std::stringstream code;
        while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
            Token token = advance();
            if (token.type == TokenType::IDENTIFIER) {
                code << "this." << token.lexeme;
            } else {
                code << token.lexeme;
            }
            code << " ";
        }
        
        consume(TokenType::RIGHT_BRACE, "Esperado '}' após código do evento");
        events.push_back(std::make_unique<Event>(name.lexeme, code.str()));
    }
    
    consume(TokenType::RIGHT_BRACE, "Esperado '}' após eventos");
    
    // Retorna o primeiro evento (por enquanto)
    return std::move(events[0]);
}

// Métodos auxiliares para consumir tokens
Token Interpreter::advance() {
    if (!isAtEnd()) current++;
    return previous();
}

Token Interpreter::peek() {
    return tokens[current];
}

Token Interpreter::previous() {
    return tokens[current - 1];
}

bool Interpreter::match(TokenType type) {
    if (check(type)) {
        advance();
        return true;
    }
    return false;
}

Token Interpreter::consume(TokenType type, const std::string& message) {
    if (check(type)) return advance();
    throw std::runtime_error(message);
}

bool Interpreter::check(TokenType type) {
    if (isAtEnd()) return false;
    return peek().type == type;
}

bool Interpreter::isAtEnd() {
    return peek().type == TokenType::EOF_TOKEN;
}

} // namespace zyra 