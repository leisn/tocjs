import { TocOptions } from "../lib/Toc";

export function WatchScroll(toc: HTMLElement, _: TocOptions,
    currentClass: string = "current", activeClass?: string) {

    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('scroll', onScroll);

    if (!toc || !currentClass)
        return;

    updateHash();

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('scroll', onScroll);

    function onHashChange() {
        updateHash();
    }

    function onScroll() {
        const tocItems = toc.querySelectorAll('li>a[href');
        let scrollY = window.scrollY;
        for (let i = tocItems.length - 1; i >= 0; i--) {
            let item = tocItems[i];
            let heading = item.getAttribute("href")!.substr(1);
            let ele = document.getElementById(heading);
            if (ele) {
                let rect = ele.getBoundingClientRect();
                let thisY = Math.floor(rect.top + window.scrollY);
                if (scrollY >= thisY) {
                    updateHash(item);
                    return;
                }
            }
        }
    }

    function updateHash(element?: Element) {
        if (!element && !Boolean(location.hash))
            return;
        let target = element ||
            toc.querySelector("a[href='" + decodeURIComponent(location.hash) + "']");
        if (!target) return;

        if (target.classList.contains(currentClass))
            return;

        if (!Boolean(activeClass)) {
            let item = toc.querySelector('li>a.' + currentClass);
            if (item) item.classList.remove(currentClass);
            target.classList.add(currentClass);
            return;
        }

        toc.querySelectorAll('li>a.' + activeClass)
            .forEach(item => {
                item.classList.remove(activeClass!, currentClass);
            });

        target.classList.add(activeClass!, currentClass);

        let parent = target.parentElement!.parentElement;//ul

        while (parent && parent != toc) {
            if (parent.tagName.toLowerCase() === 'li') {
                let a = parent.firstElementChild!;
                if (a.tagName.toLowerCase() === 'a' && a.getAttribute('href'))
                    a.classList.add(activeClass!);
                parent = parent.parentElement;
                if (!parent) break;
            }
            parent = parent.parentElement;
        }
    }
}

