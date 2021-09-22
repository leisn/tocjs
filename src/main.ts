import { Toc, TocOptions } from "./lib/Toc";
import { WatchScroll } from "./plugins/watch-scroll";

/**
 * Callback after make toc.
 */
export interface MakeCallBack {
    /**
     * @this {TOC}  tocjs - the global tocjs
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
     * @this {TOC}  tocjs - the global tocjs
     * @param {HTMLElement} toc - Generated toc element.
     * @param {TocOptions} options - The options used to generate.
     * @param {any[]} params - The arguments for plugin
     */
    (toc: HTMLElement, options: TocOptions, ...params: any[]): void;
}

interface Plugin {
    func: PluginFunc;
    params: any[];
}

const _toc = new Toc();
const plugins = new Array<Plugin>();

class TOC {
    /**
     * Make toc element.
     * @param {string | undefined} containerId - Where to place, pass `undefined` if don't want to auto place.
     * @param {string | undefined} cssSelector - Special scope where to search headings, default `document.body`.
     * @param {MakeCallBack} callback - Call back after make toc.
     * @returns {TOC} self
     */
    public make(containerId?: string, cssSelector?: string, callback?: MakeCallBack): TOC {
        var toc = _toc.Make(cssSelector);
        if (!toc) return this;

        if (containerId && toc) {
            var contaniner = document.getElementById(containerId);
            if (contaniner)
                contaniner.appendChild(toc);
        }

        plugins.forEach(plugin => {
            try {
                plugin.func.call(this, toc!, _toc.Options, ...plugin.params);
            } catch (error) {
                console.error(error);
            }
        });

        if (callback) {
            try {
                callback.call(this, toc, _toc.Options);
            } catch (error) {
                console.error(error);
            }
        }

        return this;
    }

    /**
     * Use given options to generate toc.
     * @param {TocOptions | PluginFunc} options - 
     *    typeof object:  { TocTag:"nav", TocId?, TocClass?, ulClass?, liClass?, aClass?, HeadingGenerator? }; <br/>
     *    typeof function:  function(toc: HTMLElement, options: TocOptions, ...params: any[]);<br/>
     *        invoke in `make`, after generate toc ,before callback.
     * @returns {TOC} self
     */
    public use(options: TocOptions | PluginFunc, ...pluginParams: any[]): TOC {
        if (typeof options === 'object')
            _toc.Set(options);
        else if (typeof options === 'function')
            plugins.push({ func: options, params: pluginParams });
        return this;
    }

    /**
     * Use a watch scroll plugin to mark current toc item positon of document.
     * @param {string} [currentClass='current'] - Class name for mark toc item is current, default `current`
     * @param {string | undefined} activeClass - Class name for mark current item and it's parent item, default `undefined`.
     * @returns {TOC} self
     */
    public useWatchScroll(currentClass: string = "current", activeClass?: string): TOC {
        return this.use(WatchScroll, currentClass, activeClass);
    }
}

/**
 * Toc.js global
 */
const tocjs = new TOC();

export default tocjs;