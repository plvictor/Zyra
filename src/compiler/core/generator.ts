import { Node } from './parser';

export class Generator {
    private output: string = '';
    private indentLevel: number = 0;

    generate(ast: Node[]): string {
        this.output = '';
        
        // Importações necessárias
        this.append(`import { ZyraComponent } from '@zyra/runtime';`);
        this.append(`import { createSocket } from '@zyra/socket';`);
        this.append(`import { createElement, render } from '@zyra/dom';`);
        this.newLine();

        // Gerar código para cada nó
        for (const node of ast) {
            this.generateNode(node);
            this.newLine();
        }

        return this.output;
    }

    private generateNode(node: Node): void {
        switch (node.type) {
            case 'ComponentDeclaration':
                this.generateComponent(node);
                break;
            case 'StateDeclaration':
                this.generateState(node);
                break;
            case 'SocketDeclaration':
                this.generateSocket(node);
                break;
            case 'RenderBlock':
                this.generateRender(node);
                break;
            case 'Element':
                this.generateElement(node);
                break;
        }
    }

    private generateComponent(node: Node): void {
        this.append(`export class ${node.name} extends ZyraComponent {`);
        this.indent();

        // Construtor com estado inicial
        this.append(`constructor(props) {`);
        this.indent();
        this.append(`super(props);`);
        this.append(`this.state = {};`);
        this.unindent();
        this.append(`}`);
        this.newLine();

        // Gerar corpo do componente
        for (const item of node.body) {
            this.generateNode(item);
            this.newLine();
        }

        this.unindent();
        this.append(`}`);
    }

    private generateState(node: Node): void {
        this.append(`this.state.${node.name} = ${JSON.stringify(node.initialValue)};`);
    }

    private generateSocket(node: Node): void {
        this.append(`constructor() {`);
        this.indent();
        this.append(`super();`);
        this.append(`this.socket = createSocket();`);
        
        for (const handler of node.handlers) {
            this.append(
                `this.socket.on("${handler.event}", (${handler.params.join(', ')}) => {`
            );
            this.indent();
            this.generateNode(handler.body);
            this.unindent();
            this.append(`});`);
        }

        this.unindent();
        this.append(`}`);
    }

    private generateRender(node: Node): void {
        this.append(`render() {`);
        this.indent();
        this.append(`return createElement(`);
        this.indent();
        
        for (const element of node.elements) {
            this.generateElement(element);
        }

        this.unindent();
        this.append(`);`);
        this.unindent();
        this.append(`}`);
    }

    private generateElement(node: Node): void {
        this.append(`"${node.name}",`);
        this.append(`{`);
        this.indent();

        // Gerar atributos
        for (const attr of node.attributes) {
            if (attr.name === 'style') {
                this.append(`style: {`);
                this.indent();
                this.generateStyles(attr.value);
                this.unindent();
                this.append(`},`);
            } else {
                this.append(`${attr.name}: ${this.generateValue(attr.value)},`);
            }
        }

        this.unindent();
        this.append(`}`);
    }

    private generateStyles(styles: any): void {
        for (const [key, value] of Object.entries(styles)) {
            this.append(`"${key}": ${JSON.stringify(value)},`);
        }
    }

    private generateValue(value: any): string {
        if (typeof value === 'string' && value.startsWith('$')) {
            return `this.state.${value.slice(1)}`;
        }
        return JSON.stringify(value);
    }

    private append(text: string): void {
        this.output += '  '.repeat(this.indentLevel) + text + '\n';
    }

    private newLine(): void {
        this.output += '\n';
    }

    private indent(): void {
        this.indentLevel++;
    }

    private unindent(): void {
        this.indentLevel--;
    }
} 