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
    additionals: Record<string, string>;
    edited: boolean = false;

    constructor({
        id,
        name,
        description,
        html,
        css,
        js,
        sql,
        additionals,
        edited
    }: {
        id: string;
        name: string;
        description: string;
        html: Record<string, string>;
        css: Record<string, string>;
        js: Record<string, string>;
        sql: Record<string, string>;
        additionals: Record<string, string>;
        edited?: boolean;
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.html = html;
        this.css = css;
        this.js = js;
        this.sql = sql;
        this.additionals = additionals;
        // Preserve edited flag from serialized data when available
        this.edited = (edited as boolean) ?? false;
    }
}
