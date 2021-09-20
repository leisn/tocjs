import LevelNode from "./LevelNode";
import StringBuilder from "./StringBuilder";

const headingTags = ['#', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export interface GenerateResult {
    Id: string; //must have id
    TitleInToc: string; //must have title
    TitleInHeading?: string;// can change title in heaindg , use innerHTML
}

export interface HeadingInfo {
    Id?: string;
    Title?: string;
    Target: HTMLElement;
}

class Heading implements HeadingInfo {
    Id?: string;
    Title?: string;
    Target: HTMLElement;
    constructor(target: HTMLElement, id?: string, title?: string) {
        this.Id = id;
        this.Title = title;
        this.Target = target;
    }
}

export interface TocOptions {
    TocTag: string;
    TocId?: string;
    TocClass?: string;

    ulClass?: string;
    liClass?: string;
    aClass?: string;

    HeadingGenerator?(headingInfo: HeadingInfo, Path: number[]): GenerateResult | undefined;
}

export class Toc {
    private _root: LevelNode<Heading>;
    Options: TocOptions;

    constructor(options?: TocOptions) {
        this.Options = Object.assign({
            TocTag: "nav",
            HeadingGenerator: this._defaultGenerateHeading
        }, options);
        this._root = new LevelNode<Heading>(0);
    }

    Use(options?: TocOptions): Toc {
        this.Options = Object.assign(this.Options, options);
        return this;
    }

    Make(containerId?: string, cssSelector?: string): HTMLElement | void {
        try {
            if (cssSelector) {
                let blocks = document.querySelectorAll(cssSelector);
                blocks.forEach(element => {
                    this._queryHeadings(element);
                });
            } else {
                this._queryHeadings(document.body);
            }
            if (this._root.Count < 1)
                return;

            if (this.Options.HeadingGenerator)
                this._generateHeadingId(this._root);

            let toc = document.createElement(this.Options.TocTag);

            if (containerId) {
                let contaniner = document.getElementById(containerId);
                if (!contaniner)
                    throw ("Cannot find contaniner element by id: " + containerId);
                contaniner.appendChild(toc);
            }
            if (this.Options.TocId)
                toc.id = this.Options.TocId;
            if (this.Options.TocClass) {
                let classes = toc.className;
                if (classes && classes.length > 0)
                    classes += " " + this.Options.TocClass;
                else
                    classes = this.Options.TocClass;
                toc.className = classes;
            }
            var stringBuilder = new StringBuilder();
            var result = this._toHtml(this._root, stringBuilder);
            if (result)
                toc.innerHTML = result;
            stringBuilder.Clear();
            return toc;

        } catch (error) {
            throw error;
        } finally {
            this._root.Clear();
        }
    }

    private _queryHeadings(element: Element | null): void {
        if (!element) return;

        let htmlElement = element as HTMLElement;
        if (!htmlElement) return;

        let index = headingTags.indexOf(element.tagName.toLowerCase());
        if (index > 0) {
            let node = new LevelNode<Heading>(index,
                new Heading(htmlElement, htmlElement.id,
                    htmlElement.innerText || htmlElement.innerHTML));
            this._root.Append(node);
        }

        let count = element.children.length;
        for (let i = 0; i < count; i++) {
            this._queryHeadings(element.children.item(i));
        }
    }

    //by default
    //  if heading have id, always palace in toc, if no title use id as title
    //     and not change title in heading
    //  if heading have no id but title , generate id with the title
    //  if heading have no id and no title return undefined
    private _defaultGenerateHeading(info: HeadingInfo, path: number[]): GenerateResult | undefined {
        let id = info.Id;
        let title = info.Title;
        let titleInToc = title;

        if (id && !title)
            titleInToc = decodeURIComponent(id).replace(/-/g, ' ').replace(/_/g, '-');
        else if (!id && title)
            id = title.replace(/\s+/g, '-').toLocaleLowerCase();

        if (id)
            return { Id: id, TitleInToc: titleInToc!, TitleInHeading: undefined };//return undefined won't change the heading
    }

    private _generateHeadingId(node: LevelNode<Heading>): void {
        if (!this.Options.HeadingGenerator || node.Count < 1)
            return;
        node.Children.forEach(item => {
            if (item.Value) {
                let result = this.Options.HeadingGenerator!(item.Value, item.Path);
                if (result) {
                    item.Value.Id = result.Id;
                    item.Value.Title = result.TitleInToc;

                    //can change the id of heading element
                    if (item.Value.Target.id !== result.Id)
                        item.Value.Target.id = result.Id;
                    //can change inner html in heading
                    if (result.TitleInHeading
                        && item.Value.Title !== result.TitleInHeading)
                        item.Value.Target.innerHTML = result.TitleInHeading;
                } else {
                    item.Value = undefined;//should be ignored
                }
            }
            this._generateHeadingId(item);
        });
    }

    private _toHtml(l: LevelNode<Heading>, sb: StringBuilder): string | undefined {
        if (l.Count < 1) return;

        sb.Append("<ul");
        if (this.Options.ulClass)
            sb.Append(" class='" + this.Options.ulClass + "'");
        sb.Append(">");

        for (let i = 0; i < l.Count; i++) {
            const item = l.Get(i);

            if ((!item.Value || !item.Value.Id) && item.Count < 1)
                continue;

            sb.Append("<li");
            if (this.Options.liClass)
                sb.Append(" class='" + this.Options.liClass + "'");
            sb.Append(">");

            if (item.Value && item.Value.Id) {
                sb.Append("<a href='#" + item.Value.Id + "'");
                if (this.Options.aClass)
                    sb.Append(" class='" + this.Options.aClass + "'");
                sb.Append(">" + item.Value?.Title + "</a>");
            }

            this._toHtml(item, sb);
            sb.Append("</li>");
        }

        sb.Append("</ul>");
        return sb.ToString();
    }
}