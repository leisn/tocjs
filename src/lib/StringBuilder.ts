export default class StringBuilder {

    readonly _data: Array<string>;

    NewLine: string = '\n';

    constructor() {
        this._data = new Array<string>();
    }

    Append(...items: string[]): StringBuilder {
        items.forEach(item => {
            this._data.push(item);
        });
        return this;
    }

    AppendLine(...items: string[]): StringBuilder {
        items.forEach(item => {
            this._data.push(item);
        });
        this._data.push(this.NewLine);
        return this;
    }

    AppendLines(...items: string[]): StringBuilder {
        items.forEach(item => {
            this._data.push(item);
            this._data.push(this.NewLine);
        });
        return this;
    }

    Clear(): StringBuilder {
        this._data.length = 0;
        return this;
    }

    ToString(): string {
        return this._data.join('');
    }

}
