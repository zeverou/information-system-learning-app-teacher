/**
 * A class representing a UI component.
 */
export class Component {
    id: string;
    name: string;
    description: string;
    html: string;
    css: string;
    js: string;
    sql: string;
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
        html: string;
        css: string;
        js: string;
        sql: string;
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
        if (html?.trim()) techTags.push('html');
        if (css?.trim()) techTags.push('css');
        if (js?.trim()) techTags.push('js');
        if (sql?.trim()) techTags.push('sql');

        this.tags = [...new Set([...tags, ...techTags])];
    }
}
