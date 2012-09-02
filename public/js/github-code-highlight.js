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
    var content,
        lang = ghch.lang;

    if (json &&
        json.query &&
        json.query.results &&
        json.query.results.resources &&
        json.query.results.resources.content
    ) {
        content = json.query.results.resources.content;
    } else {
        content = "Can't fetch data";
        lang = "text";
    }

    ghch.setContent(content, lang);
    ghch.highlight();

};

GithubCodeHighlighter.prototype = {
    init: function () {
        var params = this.parseQueryString(),
            content;

        this.lang = params.lang || "text";

        if (params.url) {
            this.url = params.url;
            this.fetchCode(this.url);
        } else {
            content = 'please set "url" parameter.';
            this.setContent(content, "text");
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
                parsedParam[key] = val;
            }
        }
        return parsedParam;
    },
    fetchCode: function (url) {
        var callbackName = "window.GithubCodeHighlighter.yqlCallback",
            scriptSrc = "http://query.yahooapis.com/v1/public/yql?format=json&callback=" + callbackName + "&q=",
            query,
            env = "http://www.datatables.org/alltables.env",
            scriptElem = document.createElement("script");

        url += "?raw=true";
        query = "select * from data.headers where url = '" + url + "' and ua = 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)'";
        scriptElem.src = scriptSrc + encodeURIComponent(query) + "&env=" + encodeURIComponent(env);

        document.head.appendChild(scriptElem);
    },
    setContent: function (content, lang) {
        var pre = document.createElement("pre");
        pre.innerHTML = escape(content);
        pre.setAttribute("class", "brush: " + lang);

        document.getElementById("codeArea").appendChild(pre);

    },
    highlight: function() {
        var coreJs = {
                src: "http://alexgorbatchev.com/pub/sh/current/scripts/shCore.js",
                elm: document.createElement("script")
            },
            loaderJs = {
                src: "http://alexgorbatchev.com/pub/sh/current/scripts/shAutoloader.js",
                elm: document.createElement("script")
            },
            defaultCss = {
                src: "http://alexgorbatchev.com/pub/sh/current/styles/shThemeDefault.css",
                elm: document.createElement("link")
            },
            coreCss = {
                src: "http://alexgorbatchev.com/pub/sh/current/styles/shCore.css",
                elm: document.createElement("link")
            },
            self = this;

        defaultCss.elm.href = defaultCss.src;
        defaultCss.elm.type = "text/css";
        defaultCss.elm.rel = "stylesheet";
        coreCss.elm.href = coreCss.src;
        coreCss.elm.type = "text/css";
        coreCss.elm.rel = "stylesheet";
        document.body.appendChild(coreCss.elm);
        document.body.appendChild(defaultCss.elm);

        loaderJs.elm.onload = function () {
            SyntaxHighlighter.autoloader.apply(null, self.path(
              'applescript            @shBrushAppleScript.js',
              'actionscript3 as3      @shBrushAS3.js',
              'bash shell             @shBrushBash.js',
              'coldfusion cf          @shBrushColdFusion.js',
              'cpp c                  @shBrushCpp.js',
              'c# c-sharp csharp      @shBrushCSharp.js',
              'css                    @shBrushCss.js',
              'delphi pascal          @shBrushDelphi.js',
              'diff patch pas         @shBrushDiff.js',
              'erl erlang             @shBrushErlang.js',
              'groovy                 @shBrushGroovy.js',
              'java                   @shBrushJava.js',
              'jfx javafx             @shBrushJavaFX.js',
              'js jscript javascript  @shBrushJScript.js',
              'perl pl                @shBrushPerl.js',
              'php                    @shBrushPhp.js',
              'text plain             @shBrushPlain.js',
              'py python              @shBrushPython.js',
              'ruby rails ror rb      @shBrushRuby.js',
              'sass scss              @shBrushSass.js',
              'scala                  @shBrushScala.js',
              'sql                    @shBrushSql.js',
              'vb vbnet               @shBrushVb.js',
              'xml xhtml xslt html    @shBrushXml.js'
            ));
            SyntaxHighlighter.all();
            // TODO:
            setTimeout(function () {
                self.fitWidth();
            }, 1000);
        };

        loaderJs.elm.src = loaderJs.src;

        coreJs.elm.onload = function () {
            document.body.appendChild(loaderJs.elm);
        };

        coreJs.elm.src = coreJs.src;

        document.body.appendChild(coreJs.elm);
    },
    path: function () {
        var args = arguments,
            result = [];

        for(var i = 0; i < args.length; i++) {
            result.push(args[i].replace('@', 'http://alexgorbatchev.com/pub/sh/current/scripts/'));
        }
        return result
    },
    fitWidth: function () {
        var codeArea = document.getElementsByClassName("syntaxhighlighter")[0],
            width = codeArea.scrollWidth;

        document.body.setAttribute("style", "width: " + width + "px");
    }
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
