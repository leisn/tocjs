
export class LevelNode<T> {
    Value?: T;

    constructor(level: number, value?: T) {
        this.Value = value;
        this._level = level;
        this._data = new Array<LevelNode<T>>();
    }

    get Path(): number[] {
        let path = [];
        let current = this as LevelNode<T>;
        while (current.Parent) {
            path.push(current.Parent.IndexOf(current) + 1);
            current = current.Parent;
        }
        return path.reverse();
    }

    //#region  getters
    get Parent(): LevelNode<T> | undefined {
        return this._parent;
    }

    get Level(): number {
        return this._level;
    }
    get Count(): number {
        return this._data.length;
    }

    get Children(): Array<LevelNode<T>> {
        return this._data;
    }
    //#endregion
    IndexOf(item: LevelNode<T>): number {
        return this._data.indexOf(item);
    }

    Get(index: number): LevelNode<T> {
        return this._data[index];
    }

    Clear(): void {
        this._current = undefined;
        this.Value = undefined;
        this._data.forEach(element => {
            element._parent = undefined;
        });
        this._data.length = 0;
    }

    Append(item: LevelNode<T>): void {
        if (!this._current) {
            this._data.push(item);
            item._parent = this;
            this._current = item;
            return;
        }

        if (item.Level > this._current.Level) {
            let found = this._findChildLevelLessThan(item.Level, this._current);
            let offset = item.Level - found.Level;
            if (offset > 1) {
                let current = found;
                for (let i = 0; i < offset; i++) {
                    let empty = new LevelNode<T>(item.Level + i, undefined);
                    empty._parent = current;
                    current._data.push(empty);
                    current._current = empty;
                    current = empty;
                }
                found = current;
            }
            found._data.push(item);
            found._current = item;
            item._parent = found;
            return;
        }

        let parent = this._findParentLevelLessThan(item.Level, this._current);
        if (parent) {
            this._MargeSiblings(parent, item);
            return;
        }
        this._level = item.Level - 1;
        this._MargeSiblings(this, item);
    }

    //#region privates
    private _MargeSiblings(parent: LevelNode<T>, add: LevelNode<T>): void {
        let list = new Array<number[]>();
        let startAt = -1, endBefore = -1;
        let count = parent.Count;
        for (let i = 0; i < count; i++) {
            let t = parent.Get(i);
            if (t.Level > add.Level) {
                if (startAt == -1)
                    startAt = i;
            } else if (startAt != -1) {
                endBefore = i;
                list.push([startAt, endBefore]);
                startAt = -1;
            }
        }
        if (startAt != -1) {
            endBefore = count;
            list.push([startAt, endBefore]);
        }
        for (let i = list.length - 1; i >= 0; i--) {
            let index = list[i];
            let start = index[0];
            let end = index[1];
            let empty = new LevelNode<T>(add.Level, undefined);
            empty._parent = parent;
            for (let k = start; k < end; k++) {
                let item = parent.Get(k);
                item._parent = empty;
                empty._data.push(item);
                if (start == end - 1)
                    empty._current = item;
            }
            if (end - start > 1)
                parent._data.splice(start + 1, end - start - 1);
            parent._data[start] = empty;
        }
        parent._data.push(add);
        add._parent = parent;
        parent._current = add;
    }
    private _findChildLevelLessThan(level: number, current: LevelNode<T>): LevelNode<T> {
        if (!current._current || current._current.Level >= level)
            return current;
        return this._findChildLevelLessThan(level, current._current);
    }
    private _findParentLevelLessThan(level: number, current: LevelNode<T>): LevelNode<T> | undefined {
        if (!current.Parent)
            return undefined;
        if (current.Parent.Level < level)
            return current.Parent;
        return this._findParentLevelLessThan(level, current.Parent);
    }

    private _parent?: LevelNode<T>;
    private _level: number;
    private _current?: LevelNode<T>;
    private _data: Array<LevelNode<T>>;
    //#endregion
}
export default LevelNode;
