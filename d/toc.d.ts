//Type definitions for toc.js
//Project: toc.js
//Version: 0.1.1
//Definitions by: leisn, https://leisn.com

declare namespace tocjs {

    /**
     * The result of custom heading generator
     */
    export interface GenerateResult {
        /**
         * The id to current heading
         */
        Id: string;
        /**
         * The title to current heading in toc
         */
        TitleInToc: string;
        /**
         * The title to current heading
         */
        TitleInHeading?: string;
    }
    /**
     * The heading information in document.
     */
    export interface HeadingInfo {
        /**
         * The id of current heading, by default `Target.id`
         */
        Id?: string;
        /**
         * The content of current heading, by default `Target.innerText || Target.innerHTML`
         */
        Title?: string;
        /**
         * The html element of current heading, e.g. `h1`, `h2`...
         */
        Target: HTMLElement;
    }

    /**
     *~ Options of toc generator.
     */
    export interface TocOptions {
        /**
         *~ Tag of generated toc element (default `nav`).
         */
        TocTag: string;
        /**
         *~ Id of generated toc element (default `undefined`).
         */
        TocId?: string;
        /**
        *~ Classes of generated toc element (default `undefined`).
        */
        TocClass?: string;

        /**
         *~ Classes of generated `ul` element (default `undefined`).
         */
        ulClass?: string;
        /**
         *~ Classes of generated `li` element (default `undefined`).
         */
        liClass?: string;
        /**
         *~ Classes of generated `a` element (default `undefined`).
         */
        aClass?: string;

        /**
         * The function to generate heading id and title.
         * by default, 
         *   if heading have id, always palace in toc, if no title generate one toc title
         *      and not change title in heading;
         *   if heading have no id but title , generate id with the title;
         *   if heading have no id and no title return undefined;
         * @param headingInfo The heading info
         * @param Path The path of this heading, from top to current, start at 1
         * @returns `GenerateResult | undefined`, if you want ignore it anyway return undefined
         */
        HeadingGenerator?(headingInfo: HeadingInfo, Path: number[]): GenerateResult | undefined;
    }

    /**
     * Callback after make toc.
     */
    export interface MakeCallBack {
        /**
         * @this {typeof tocjs}  tocjs - the global tocjs
         * @param {HTMLElement} toc - Generated toc element.
         * @param {TocOptions} options - The options used to generate.
         */
        (toc: HTMLElement, options: TocOptions): void;
    }

    /**
     * Interface for plugin fucntion
     */
    export interface PluginFunc {
        /**
         * @this {typeof tocjs}  tocjs - the global tocjs
         * @param {HTMLElement} toc - Generated toc element.
         * @param {TocOptions} options - The options used to generate.
         * @param {any[]} params - The arguments for plugin
         */
        (toc: HTMLElement, options: TocOptions, ...params: any[]): void;
    }

    /**
     * Make toc element.
     * @param {string | undefined} containerId - Where to place, pass `undefined` if don't want to auto place.
     * @param {string | undefined} cssSelector - Special scope where to search headings, default `document.body`.
     * @param {MakeCallBack} callback - Call back after make toc.
     * @returns {typeof tocjs} tocjs itself
     */
    export function make(containerId?: string, cssSelector?: string, callback?: MakeCallBack): typeof tocjs;

    /**
     * Use given options to generate toc.
     * @param {TocOptions | PluginFunc} options - 
     *    typeof object:  { TocTag:"nav", TocId?, TocClass?, ulClass?, liClass?, aClass?, HeadingGenerator? }; <br/>
     *    typeof function:  function(toc: HTMLElement, options: TocOptions, ...params: any[]);<br/>
     *        invoke in `make`, after generate toc ,before callback.
     * @returns {typeof tocjs} tocjs itself
     */
    export function use(options: TocOptions | PluginFunc, ...pluginParams: any[]): typeof tocjs;

    /**
     * Use a watch scroll plugin to mark current toc item positon of document.
     * @param {string} [currentClass='current'] - Class name for mark toc item is current, default `current`
     * @param {string | undefined} activeClass - Class name for mark current item and it's parent item, default `undefined`.
     * @returns {typeof tocjs} tocjs itself
     */
    export function useWatchScroll(currentClass?: string, activeClass?: string): typeof tocjs;
}

export = tocjs;
export as namespace tocjs;
