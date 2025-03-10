import { Node } from './parser';

interface Import {
    name: string;
    alias: string;
}

interface Attribute {
    name: string;
    value: Node;
}

interface Property extends Node {
    name: string;
    value: Node;
}

interface Handler {
    event: string;
    parameter: string;
    body: Node;
}

interface Endpoint {
    path: string;
    properties: Property[];
}

interface Statement extends Node {
    type: string;
    expression?: Node;
    value?: Node;
    condition?: Node;
    thenBranch?: Node;
    elseBranch?: Node;
    item?: string;
    collection?: Node;
    body?: Node;
}

interface BodyItem extends Node {
    type: string;
    name?: string;
    initialValue?: Node;
    elements?: Node[];
}

export class Generator {
    private output: string = '';
    private indentLevel: number = 0;

    generate(nodes: Node[]): string {
        return nodes.map(node => this.generateNode(node)).join('\n\n');
    }

    private generateNode(node: Node): string {
        switch (node.type) {
            case "ImportDeclaration":
                return this.generateImport(node);
            case "AppDeclaration":
                return this.generateApp(node);
            case "ServerDeclaration":
                return this.generateServer(node);
            case "ComponentDeclaration":
                return this.generateComponent(node);
            case "PageDeclaration":
                return this.generatePage(node);
            default:
                throw new Error(`Tipo de nó desconhecido: ${node.type}`);
        }
    }

    private generateImport(node: Node): string {
        const imports = (node.imports as Import[]).map(imp => {
            if (imp.name === imp.alias) {
                return imp.name;
            }
            return `${imp.name} as ${imp.alias}`;
        });

        if (imports.length === 1 && !node.source.startsWith(".")) {
            return `import ${imports[0]} from "${node.source}";`;
        }

        return `import { ${imports.join(", ")} } from "${node.source}";`;
    }

    private generateApp(node: Node): string {
        const properties = (node.properties as Property[]).map(prop => {
            if (prop.name === "routes") {
                // Tratamento especial para rotas
                const routesObj = prop.value as Node;
                if (routesObj.type === "ObjectExpression") {
                    const routes = (routesObj.properties as Property[])
                        .map(route => {
                            const key = `"${route.name.replace(/\//g, '_')}"`;
                            return `    ${key}: ${this.generateExpression(route.value)}`;
                        })
                        .join(",\n");
                    return `  routes: {
${routes}
  }`;
                }
                return `  routes: {}`;
            }
            if (prop.name === "config" || prop.name === "handlers") {
                return `  ${prop.name}: ${this.generateExpression(prop.value)}`;
            }
            return `  ${this.generateProperty(prop)}`;
        }).join(",\n");
        
        return `
// Configuração da aplicação
const app = {
${properties}
};

// Inicializar a aplicação
initializeApp(app);`;
    }

    private generateServer(node: Node): string {
        const properties = (node.properties as Property[]).map(prop => {
            if (prop.type === "SocketDeclaration") {
                return this.generateSocket(prop);
            }
            if (prop.name === "api") {
                return this.generateAPI(prop);
            }
            return this.generateProperty(prop);
        }).filter(prop => prop !== "").join(",\n");
        
        return `
// Configuração do servidor
const server = {
${this.indentText(properties)}
};

// Inicializar o servidor
initializeServer(server);`;
    }

    private generateSocket(node: Node): string {
        const handlers = (node.handlers as Handler[]).map(handler => {
            const body = this.generateBlock(handler.body);
            return `socket.on("${handler.event}", (${handler.parameter}) => {
${this.indentText(body, 1)}
})`;
        }).join(",\n");
        
        return `socket: {
    connect: () => {
        const socket = io();
        ${handlers}
        return socket;
    }
}`;
    }

    private generateAPI(node: Node): string {
        const endpoints = (node.endpoints as Endpoint[]).map(endpoint => {
            const properties = endpoint.properties.map(prop => {
                if (prop.name === "handler") {
                    const params = (prop.value as any).params.join(", ");
                    const body = this.generateBlock(prop.value);
                    return `    async handler(${params}) {
${this.indentText(body, 2)}
    }`;
                }
                return `    ${prop.name}: ${this.generateExpression(prop.value)}`;
            }).join(",\n");

            // Escapar caracteres especiais na rota e adicionar aspas
            const path = endpoint.path.replace(/\//g, '_').replace(/[^\w\s]/g, '_');
            
            return `  "${path}": {
${properties}
  }`;
        }).join(",\n");

        return `api: {
${endpoints}
}`;
    }

    private generateComponent(node: Node): string {
        const body = (node.body as BodyItem[]).map(item => {
            if (item.type === "StateDeclaration") {
                return `  state: {
    ${item.name}: ${this.generateExpression(item.initialValue as Node)}
  }`;
            }
            if (item.type === "RenderBlock") {
                return `  render() {
    return ${this.generateElements(item.elements as Node[])};
  }`;
            }
            return this.generateProperty(item as Property);
        }).join(",\n");
        
        return `
// Componente ${node.name}
export class ${node.name} extends Component {
${body}
}`;
    }

    private generatePage(node: Node): string {
        const body = (node.body as BodyItem[]).map(item => {
            if (item.type === "StateDeclaration") {
                return `  state: {
    ${item.name}: ${this.generateExpression(item.initialValue as Node)}
  }`;
            }
            if (item.type === "RenderBlock") {
                return `  render() {
    return ${this.generateElements(item.elements as Node[])};
  }`;
            }
            return this.generateProperty(item as Property);
        }).join(",\n");
        
        return `
// Página ${node.name}
export class ${node.name} extends Page {
${body}
}`;
    }

    private generateElements(elements: Node[]): string {
        return elements.map(element => {
            const attributes = (element.attributes as Attribute[]).map(attr => {
                return `${attr.name}={${this.generateExpression(attr.value)}}`;
            }).join(" ");

            return `<${element.name} ${attributes} />`;
        }).join("\n");
    }

    private generateProperty(prop: Property): string {
        if (!prop || !prop.type) {
            return "";
        }

        if (prop.type === "Property") {
            if (prop.value && prop.value.type === "Block") {
                return `${prop.name}: {
${this.indentText(this.generateBlock(prop.value))}
}`;
            }
            return `${prop.name}: ${this.generateExpression(prop.value)}`;
        }
        return this.generateExpression(prop);
    }

    private generateBlock(node: Node): string {
        if (!node || !node.statements) {
            if (node && node.type === "Block") {
                return "{}";
            }
            return "";
        }

        const statements = (node.statements as Statement[])
            .map(stmt => {
                if (!stmt || !stmt.type) {
                    return "";
                }

                if (stmt.type === "ExpressionStatement") {
                    const expr = this.generateExpression(stmt.expression as Node);
                    return expr ? `${expr};` : "";
                }
                if (stmt.type === "Property") {
                    const prop = this.generateProperty(stmt as Property);
                    return prop ? `${prop},` : "";
                }
                if (stmt.type === "ReturnStatement") {
                    const value = this.generateExpression(stmt.value as Node);
                    return value ? `return ${value};` : "return;";
                }
                if (stmt.type === "IfStatement") {
                    const condition = this.generateExpression(stmt.condition as Node);
                    const thenBranch = this.generateBlock(stmt.thenBranch as Node);
                    let result = `if (${condition}) {\n${this.indentText(thenBranch)}\n}`;
                    
                    if (stmt.elseBranch) {
                        const elseBranch = this.generateBlock(stmt.elseBranch);
                        result += ` else {\n${this.indentText(elseBranch)}\n}`;
                    }
                    
                    return result;
                }
                if (stmt.type === "ForStatement") {
                    const collection = this.generateExpression(stmt.collection as Node);
                    const body = this.generateBlock(stmt.body as Node);
                    return `for (const ${stmt.item} of ${collection}) {\n${this.indentText(body)}\n}`;
                }
                return "";
            })
            .filter(stmt => stmt.trim() !== "")
            .join("\n");

        return statements;
    }

    private generateExpression(node: Node): string {
        if (!node || !node.type) {
            return "";
        }

        switch (node.type) {
            case "StringLiteral":
                return `"${node.value}"`;
            case "NumberLiteral":
                return node.value.toString();
            case "BooleanLiteral":
                return node.value.toString();
            case "Identifier":
                return node.name;
            case "MemberExpression":
                return `${this.generateExpression(node.object)}.${node.property.name}`;
            case "CallExpression":
                const args = ((node.arguments || []) as Node[]).map(arg => this.generateExpression(arg)).join(", ");
                return `${this.generateExpression(node.callee)}(${args})`;
            case "ArrayExpression":
                const elements = ((node.elements || []) as Node[]).map(elem => this.generateExpression(elem)).join(", ");
                return `[${elements}]`;
            case "ObjectExpression":
                const properties = ((node.properties || []) as Property[])
                    .map(prop => {
                        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(prop.name) ? 
                            prop.name : 
                            `"${prop.name.replace(/\//g, '_')}"`;
                        const value = this.generateExpression(prop.value);
                        return value ? `${key}: ${value}` : null;
                    })
                    .filter(prop => prop !== null)
                    .join(",\n    ");
                return properties ? `{\n    ${properties}\n  }` : "{}";
            case "Block":
                const blockContent = this.generateBlock(node);
                return blockContent ? `{\n    ${blockContent}\n  }` : "{}";
            case "ArrowFunctionExpression":
            case "FunctionExpression":
                const params = (node.params || []).join(", ");
                const body = this.generateBlock(node.body);
                if (node.type === "ArrowFunctionExpression") {
                    return `(${params}) => {\n    ${body}\n  }`;
                } else {
                    const name = node.name ? ` ${node.name}` : "";
                    return `function${name}(${params}) {\n    ${body}\n  }`;
                }
            case "ApiDeclaration":
                return this.generateAPI(node);
            case "SocketDeclaration":
                return this.generateSocket(node);
            case "Property":
                return this.generateProperty(node as Property);
            default:
                console.log("Node type não suportado:", node.type);
                return "{}";
        }
    }

    private indentText(code: string, level: number = 1): string {
        const spaces = "  ".repeat(level);
        return code.split("\n").map(line => spaces + line).join("\n");
    }

    private append(text: string): void {
        this.output += '  '.repeat(this.indentLevel) + text + '\n';
    }

    private newLine(): void {
        this.output += '\n';
    }

    private incrementIndent(): void {
        this.indentLevel++;
    }

    private decrementIndent(): void {
        this.indentLevel--;
    }
} 