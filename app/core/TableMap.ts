export class TableMap {
    constructor(public tableName: string | null, public columnName: string | null, public variableAsName: string, public columnType: ColumnType, public tableAlias?: string) { }

    public toString(): string {
        if (this.tableName === null || this.columnName === null) {
            return `${this.variableAsName}`;
        }
        if (this.tableAlias) {
            return `${this.tableAlias}.${this.columnName} as ${this.variableAsName}`;
        } else {
            return `${this.tableName}.${this.columnName} as ${this.variableAsName}`;
        }
    }
}
