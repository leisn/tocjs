import { Toc, TocOptions } from "./lib/Toc";

const handle = new Toc();

/**
 * Make toc element, 
 * place in 'containerId', search heading scope in 'cssSelector'.
 * @param options undefined | ( 'containerId', 'cssSelector') | { containerId:"", cssSelector:""} 
 * @returns Toc Element when no containerId, otherwise void.
 * @throws Throw an error when given 'containerId' and cannot find it.
 */
function make(options: any): HTMLElement | void {
    let containerId = undefined;
    let cssSelector = undefined;

    if (typeof options === 'object') {
        containerId = options.containerId;
        cssSelector = options.cssSelector;
    } else if (typeof options === 'string')
        containerId = arguments[0];

    if (arguments.length > 1)
        cssSelector = arguments[1];

    return handle.Make(containerId, cssSelector);
}

/**
 * Use given options to generate toc.
 * @param options
 * object { TocTag:"nav", TocId?, TocClass?, ulClass?, liClass?, aClass?, HeadingGenerator? }
 * @returns tocjs itself
 */
function use(options: TocOptions): typeof tocjs {
    handle.Use(options);
    return tocjs;
}

var tocjs = { make, use };

export default tocjs;