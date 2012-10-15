(function () {

function escape(str) {
    return str
        .split('&').join('&amp;')
        .split('"').join('&quot;')
        .split("'").join('&#039;')
        .split('<').join('&lt;')
        .split('>').join('&gt;');
}

function GithubCodeHighlighter () {};

GithubCodeHighlighter.yqlCallback = function (json) {
    var contentl

    if (json &&
        json.query &&
        json.query.results &&
        json.query.results.resources &&
        json.query.results.resources.content
    ) {
        content = json.query.results.resources.content;
    } else {
        content = "Can't fetch data";
    }

    ghch.setContent(content);
    ghch.highlight();

};

GithubCodeHighlighter.prototype = {
    init: function () {
        var params = this.parseQueryString(),
            content;

        if (params.url) {
            this.url = params.url;
            this.fetchCode(this.url);
        } else {
            content = 'please set "url" parameter.';
            this.setContent(content);
            this.highlight();
        }

    },
    parseQueryString: function () {
        var query = window.location.search.substring(1),
            params = query.split("&"),
            i, len, 
            pos, val, key,
            parsedParam = {};

        for (i = 0, len = params.length;i < len;i++) {
            pos = params[i].indexOf("=");
            if (pos > 0) {
                key = params[i].substring(0, pos);
                val = params[i].substring(pos + 1);
                parsedParam[key] = decodeURIComponent(val);
            }
        }
        return parsedParam;
    },
    fetchCode: function (url) {
        var callbackName = "window.GithubCodeHighlighter.yqlCallback",
            scriptSrc = "http://query.yahooapis.com/v1/public/yql?format=json&callback=" + callbackName + "&q=",
            query,
            env = "http://www.datatables.org/alltables.env",
            dmyUa = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)";
            scriptElem = document.createElement("script");

        url += "?raw=true";
        query = "select * from data.headers where url = '" + url + "' and ua = '" + dmyUa + "'";
        scriptElem.src = scriptSrc + encodeURIComponent(query) + "&env=" + encodeURIComponent(env);

        document.head.appendChild(scriptElem);
    },
    setContent: function (content) {
        var pre = document.createElement("pre"),
            metaArea = document.createElement("div"),
            fileName;

        fileName = this.url.match(/[^/]+$/)[0];
        metaArea.innerHTML = 'view original file. <a href="' + this.url + '">' + escape(fileName) + '</a>';
        document.getElementById("codeArea").appendChild(metaArea);

        pre.innerHTML = escape(content);
        pre.setAttribute("class", "prettyprint linenums");

        document.getElementById("codeArea").appendChild(pre);
    },
    highlight: function () {
        prettyPrint();
        this.fitWidth();
    },
    fitWidth: function () {
        var codeArea = document.getElementsByClassName("prettyprint")[0],
            width = codeArea.scrollWidth;

        document.body.setAttribute("style", "width: " + width + "px");
    },
};


var ghch = new GithubCodeHighlighter();

if (!window.GithubCodeHighter) {
    window.GithubCodeHighlighter = GithubCodeHighlighter;
}

if (window.addEventListner) {
    window.addEventListner("load", ghch.init);
} else if(window.attachEvent){
    window.attachEvent("onload", ghch.init);
} else {
    var onloadFunc = window.onload;
    if (typeof onloadFunc === "function") {
        window.onload = function () {
            onloadFunc();
            ghch.init();
        }
    } else {
        window.onload = function () {
            ghch.init();
        }
    }
}

}());
