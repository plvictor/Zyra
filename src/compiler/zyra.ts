import * as fs from 'fs';
import * as path from 'path';

interface ZyraComponent {
    name: string;
    state: Record<string, any>;
    methods: Record<string, Function>;
    template: string;
}

class ZyraCompiler {
    private static instance: ZyraCompiler;
    
    private constructor() {}
    
    static getInstance(): ZyraCompiler {
        if (!ZyraCompiler.instance) {
            ZyraCompiler.instance = new ZyraCompiler();
        }
        return ZyraCompiler.instance;
    }

    compile(source: string): string {
        // Remover comentários
        source = this.removeComments(source);
        
        // Extrair componentes
        const components = this.extractComponents(source);
        
        // Gerar código JavaScript
        return this.generateJavaScript(components);
    }

    private removeComments(source: string): string {
        return source.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    }

    private extractComponents(source: string): ZyraComponent[] {
        const componentRegex = /component\s+(\w+)\s*{([^}]*)}/g;
        const components: ZyraComponent[] = [];
        let match;

        while ((match = componentRegex.exec(source)) !== null) {
            const [_, name, content] = match;
            const component: ZyraComponent = {
                name,
                state: this.extractState(content),
                methods: this.extractMethods(content),
                template: this.extractTemplate(content)
            };
            components.push(component);
        }

        return components;
    }

    private extractState(content: string): Record<string, any> {
        const stateRegex = /state\s+(\w+)\s*=\s*([^;]+);/g;
        const state: Record<string, any> = {};
        let match;

        while ((match = stateRegex.exec(content)) !== null) {
            const [_, name, value] = match;
            state[name] = eval(value);
        }

        return state;
    }

    private extractMethods(content: string): Record<string, Function> {
        const methodRegex = /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g;
        const methods: Record<string, Function> = {};
        let match;

        while ((match = methodRegex.exec(content)) !== null) {
            const [_, name, body] = match;
            methods[name] = new Function(body);
        }

        return methods;
    }

    private extractTemplate(content: string): string {
        const templateRegex = /render\s*{([^}]*)}/;
        const match = templateRegex.exec(content);
        return match ? match[1].trim() : '';
    }

    private generateJavaScript(components: ZyraComponent[]): string {
        let output = '';

        for (const component of components) {
            output += `
class ${component.name} extends ZyraComponent {
    constructor() {
        super();
        ${Object.entries(component.state)
            .map(([key, value]) => `this.state.${key} = ${JSON.stringify(value)};`)
            .join('\n        ')}
    }

    ${Object.entries(component.methods)
        .map(([name, func]) => `${name}() {\n        ${func.toString()}\n    }`)
        .join('\n\n    ')}

    render() {
        return \`${this.transformTemplate(component.template)}\`;
    }
}
`;
        }

        return output;
    }

    private transformTemplate(template: string): string {
        // Transformar sintaxe Zyra em HTML + CSS
        return template
            .replace(/(\w+)\s*{([^}]*)}/g, '<div class="$1">$2</div>')
            .replace(/style:\s*{([^}]*)}/g, 'style="$1"')
            .replace(/\$(\w+)/g, '${this.state.$1}');
    }

    compileFile(filePath: string): void {
        const source = fs.readFileSync(filePath, 'utf-8');
        const compiled = this.compile(source);
        const outputPath = filePath.replace('.zy', '.js');
        fs.writeFileSync(outputPath, compiled);
    }
}

export const compiler = ZyraCompiler.getInstance(); 