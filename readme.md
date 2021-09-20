## tocjs ![GitHub](https://img.shields.io/github/license/leisn/tocjs) ![npm (scoped)](https://img.shields.io/npm/v/@leisn/tocjs)

Tocjs is a browser side toc generator, by query headings.

> Headings: [h1, h2, h3, h4, h5, h6]

### Usage

```html
<!DOCTYPE html>
<html>
<body>
    <div id="toc-container"></div>
    <abbr class="toc-scope">
        <h1 id="top-head">top head</h1>
        ...other headings
    </div>

    <script src="../dist/toc.min.js"></script>
    <script>
        tocjs.use({
            TocTag: "nav",
            TocId: "toc",
            TocClass: "toc",
            ulClass: "toc-list",
            liClass: "toc-item",
            aClass: "toc-link"
        }).make('toc-container', 'article.toc-scope');
    </script>
</body>
</html>
```

### Functions

* __make(options?: string | object, cssSelector?: string): HTMLElement | void;__
  
    _return_: The generated toc element, `undefinded` if got an error.
    
    _throw_: When given a `containerId` but cannot find it.
    
    _options_: nullable
    
    * _typeof string_: `containerId`
    
    * _typeof object_: 
    
      ``` typescript
      {
          containerId:string,
          cssSelector:string
      }
      ```
    
    _cssSelector_: nullable, string, query scope of headings, if defined will cover defined in `options`.

    e.g.
    ``` typescript
    // No arguments
    var toc = make(); 
     
    //Place toc in special element
    make('containerId'); 
    // same as
    make({containerId:'containerId'});
    
    // Query headings in all '.toc-scope' elements,then place toc in special element
    make('containerId','.toc-scope');
    // same as
    make({
        containerId:'containerId',
        cssSelector:'.toc-scope'
    });
    // same as
    make({containerId:'containerId', cssSelector:'whatever'},
        '.toc-scope');
    
    // Just set query scope, return the generated toc element
    var toc= make({cssSelector:'.toc-scope'});
    // same as
    var toc =make(null,'.toc-scope');
    ```


* __use(options: TocOptions): tocjs;__

    _return_: `tocjs`
  
    _options_:
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


### build

> Notice: I use [yarn v2](https://yarnpkg.com/getting-started/install).

```bash
$ git clone https://github.com/leisn/tocjs.git
$ cd tocjs
$ yarn install
$ yarn test
$ yarn build
```

