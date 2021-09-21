import { Toc, TocOptions } from "./lib/Toc";

/**
 * Callback after make toc.
 */
export interface MakeCallBack {
    /**
     * @param {typeof tocjs}  tocjs - the global tocjs
     * @param {HTMLElement| undefined} toc - Generated toc element.
     * @param {TocOptions} options - The options used to generate.
     */
    (this: typeof tocjs, toc: HTMLElement | undefined, options: TocOptions): void;
}

const handle = new Toc();

/**
 * Make toc element.
 * @param {string | undefined} containerId - Where to place, pass `undefined` if don't want to auto place.
 * @param {string | undefined} cssSelector - Special scope where to search headings, default `document`.
 * @param {MakeCallBack} callback - Call back after make toc.
 * @returns {typeof tocjs} tocjs itself
 */
function make(containerId?: string, cssSelector?: string, callback?: MakeCallBack): typeof tocjs {

    var toc = handle.Make(cssSelector);

    if (containerId && toc) {
        var contaniner = document.getElementById(containerId);
        if (contaniner)
            contaniner.appendChild(toc);
    }

    if (callback)
        callback.call(tocjs, toc, handle.Options);

    return tocjs;
}

/**
 * Use given options to generate toc.
 * @param {TocOptions} options -
 *      { TocTag:"nav", TocId?, TocClass?, ulClass?, liClass?, aClass?, HeadingGenerator? }; 
 * @returns {typeof tocjs} tocjs itself
 */
function use(options: TocOptions): typeof tocjs {
    handle.Set(options);
    return tocjs;
}

var tocjs = { make, use };

export default tocjs;