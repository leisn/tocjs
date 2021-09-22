## tocjs ![GitHub](https://img.shields.io/github/license/leisn/tocjs) ![npm (scoped)](https://img.shields.io/npm/v/@leisn/tocjs)

Tocjs is a browser side toc generator, by query headings.

> Headings: [h1, h2, h3, h4, h5, h6]

### Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@leisn/tocjs@0.1.0/dist/toc.min.js"></script>

<script>
    // containerId is where to place toc
    tocjs.make('containerId');     
</script>
```

### Sample
```html
<!DOCTYPE html>
<html>
<body>
    <div id="toc-container"></div>
    <article class="toc-scope">
        <h1 id="top-head">top head</h1>
        <!-- ...other headings -->
    </article>

    <script src="https://cdn.jsdelivr.net/npm/@leisn/tocjs@0.1.1/dist/toc.min.js"></script>
    <script>
        // with full options
        tocjs.use({
            TocTag: "nav",
            TocId: "toc",
            TocClass: "toc",
            ulClass: "toc-list",
            liClass: "toc-item",
            aClass: "toc-link",
            // implements this to custom 
            HeadingGenerator:(info,path) => { 
                let id = info.Id;
                let title = info.Title;
                let element = info.Target;

                //your code
                
                return {Id: id, TitleInToc: title, TitleInHeading: undefinded};
            }
        }).make('toc-container', 'article.toc-scope');
    </script>
</body>
</html>
```

### Functions

* __make(containerId ?: string, cssSelector ?: string, callback ?: MakeCallBack): tocjs;__

    _containerId_: nullable, the element id to place toc element, pass `undefined` if don't want to auto place.
    _cssSelector_: nullable, special scope to search headings, use `querySelectorAll`, default `document`.
    _callback_: nullable, callback after toc generated, params `(tocElement, tocOptions)`, you can do someting with toc element, __notice__ if _containerId_ was given the toc element already added in container.
    
* __use(options: TocOptions | PluginFunc, ...pluginParams: any[]): tocjs;__
    _options_: `not null`
    
    * _type of function_:
      > Invoke in `make`, after generate toc ,before callback.
      
      _toc_: the generated toc element.
      _options_: the options used to generation.
      _params_: the arguments pass to function when invoke.
    
      ```typescript
      //PluginFunc:
      function (toc: HTMLElement, options: TocOptions, ...params: any[]): void;
      ```
      
    * _typeof object_: 
    
      ```typescript
      interface TocOptions {
          TocTag: string;  // default 'nav', not null, Tag of generated toc element.
          TocId?: string;  // nullable, Id of generated toc element.
          TocClass?: string; //nullable, Classes of generated toc element.
      
          ulClass?: string; // nullable, Classes of generated `ul` element.
          liClass?: string; // nullable, Classes of generated `li` element.
          aClass?: string; // nullable, Classes of generated `a` element.
      
          // nullable,Custom method  to generate heading id and title, that to use build toc link or modify heading content (use innerHTML).
          HeadingGenerator?(headingInfo: HeadingInfo, Path: number[]): GenerateResult | undefined;
      }
      ```
    
    _`HeadingGenerator?(headingInfo: HeadingInfo, Path: number[]): GenerateResult | undefined;`_:
    
    > by default: 
    >
    > 1. If heading have id, always palace in toc, if no title use id as title, and not change title in heading.
    > 2. If heading have no id but title , generate id with the title.
    > 3. If heading have no id and no title , ignore it return undefined.
    
    * _Path_: The path of current heading, form top to current, start at 1.
    * _HeadingInfo_: The heading information of current heading.
    
      ```typescript
      interface HeadingInfo {
          // nullable, id in document element, default `Target.id`
          Id?: string; 
          // nullable, content of heading element default `Target.(innerText || innerHTML)`.
          Title?: string; 
          // not null, the heading element, e.g. `h2`.
          Target: HTMLElement; 
      }
      ```
    * _return_: The result of generated, `undefined` to ignore current heading.
      
      ```typescript
       interface GenerateResult {
          // not null, the final id value to toc link and heading element id.
          // default (element.id || element.innerText)
          Id: string; 
          // not null, the content in generated toc link.
          // default if Id!=undefined (element.innerText)
          TitleInToc: string; 
          // nullable, the changed content of heading element (use innerHTML to change).
          // default undefined
          TitleInHeading?: string;
      }
      ```
    
* __useWatchScroll(currentClass: string = "current", activeClass?: string): tocjs;__
  
  > **v0.1.1 added**
  >
  > Use a watch scroll plugin to mark current toc item positon of document.
  > _currentClass_ : `not null`, if null not happen. Class name for mark toc item is current, default `current`.
  > _activeClass_: nullable, Class name for mark current item and it's parent item, default `undefined`.



### build

> Notice: I use [yarn v2](https://yarnpkg.com/getting-started/install).

```bash
$ git clone https://github.com/leisn/tocjs.git
$ cd tocjs
$ yarn install
$ yarn test
$ yarn build
```

