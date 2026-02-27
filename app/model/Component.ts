/**
 * A class representing a UI component.
 */
export class Component {
    id: string;
    name: string;
    description: string;
    html: Record<string, string>;
    css: Record<string, string>;
    js: Record<string, string>;
    sql: Record<string, string>;
    tags: string[];
    edited: boolean = false;

    constructor({
        id,
        name,
        description,
        html,
        css,
        js,
        sql,
        tags = [],
        edited
    }: {
        id: string;
        name: string;
        description: string;
        html: Record<string, string>;
        css: Record<string, string>;
        js: Record<string, string>;
        sql: Record<string, string>;
        tags?: string[];
        edited?: boolean;
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.html = html;
        this.css = css;
        this.js = js;
        this.sql = sql;
        this.edited = (edited as boolean) ?? false;

        // Auto-generate technology tags based on content
        const techTags: string[] = [];
        if (Object.values(html || {}).some(v => v?.trim())) techTags.push('html');
        if (Object.values(css || {}).some(v => v?.trim())) techTags.push('css');
        if (Object.values(js || {}).some(v => v?.trim())) techTags.push('js');
        if (Object.values(sql || {}).some(v => v?.trim())) techTags.push('sql');

        this.tags = [...new Set([...tags, ...techTags])];
    }
}
