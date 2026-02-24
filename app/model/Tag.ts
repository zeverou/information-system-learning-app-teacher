export class Tag {
    constructor(
        public id: number,
        public name: string,
        public color: string
    ) { }

    static fromJSON(json: any): Tag {
        return new Tag(
            json.id,
            json.name,
            json.color
        );
    }
}