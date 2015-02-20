// Generated by CoffeeScript 1.9.0
(function() {
  var bootstrapVersion, getAlias, headerEmpSel, htmlRender, jqVersion, mdEndpoint, mdHash, mdRender, proto, qS, qSA, rootSel;

  mdEndpoint = 'https://api.github.com/markdown/raw';

  rootSel = 'xmp';

  bootstrapVersion = '3.3.2';

  jqVersion = '2.1.3';

  proto = location.protocol !== 'https:' ? 'http:' : void 0;

  headerEmpSel = 'h1';

  qS = function(s) {
    return document.querySelector(s);
  };

  qSA = function(s) {
    return document.querySelectorAll(s);
  };

  mdRender = function(md, cb) {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('POST', mdEndpoint, true);
    xhr.setRequestHeader('content-Type', 'text/plain');
    xhr.onload = function() {
      if (xhr.status === 200) {
        return cb(xhr.responseText);
      }
    };
    return xhr.send(md);
  };

  mdHash = function(s) {
    var c, hash, i, _i, _len;
    hash = 0;
    for (i = _i = 0, _len = s.length; _i < _len; i = ++_i) {
      c = s[i];
      hash = s.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return hash >>> 0;
  };

  getAlias = function(s) {
    return s.trim().toLowerCase().split(/\s+/g).join('-');
  };

  htmlRender = function(title, mdContent, themeName, menuBySel, menuMode, favicon) {
    var collectMenus, mdChecksumKey, themeCss, visualize;
    themeCss = proto + "//maxcdn.bootstrapcdn.com/";
    if (themeName) {
      themeCss += "bootswatch/" + bootstrapVersion + "/" + themeName + "/bootstrap.min.css";
    } else {
      themeCss += "bootstrap/" + bootstrapVersion + "/css/bootstrap.min.css";
    }
    collectMenus = function(menuBySel) {
      var el, elAnchor, elId, elVal, navBtn, navContainer, navElement, targetElements, _i, _len;
      targetElements = qSA(menuBySel);
      if (targetElements.length) {
        navContainer = document.querySelector('nav.navbar>div.container');
        navElement = '<div id=navbar class="navbar-collapse collapse"><ul class="nav navbar-nav">';
        for (_i = 0, _len = targetElements.length; _i < _len; _i++) {
          el = targetElements[_i];
          elVal = el.textContent.trim();
          elId = getAlias(elVal);
          elAnchor = document.createElement('span');
          elAnchor.style.position = 'absolute';
          elAnchor.style.display = 'inline-block';
          elAnchor.style.height = elAnchor.style.width = '0px';
          elAnchor.style.visibility = 'hidden';
          elAnchor.style.top = '-2em';
          elAnchor.id = elId;
          el.id = "heading-" + elId;
          el.style.position = 'relative';
          el.appendChild(elAnchor);
          navElement += "<li><a href=\"#" + elId + "\">" + elVal + "</a></li>";
        }
        navElement += '</ul></div>';
        return navContainer.insertAdjacentHTML('beforeend', navElement);
      } else {
        navBtn = qS('nav.navbar button.navbar-toggle');
        return navBtn.parentNode.removeChild(navBtn);
      }
    };
    visualize = function(htmlContent) {
      var bsScript, el, jqScript, linkCss, linkFav, metaCharset, metaIe, metaViewport, navBtnSkeleton, navSkeleton, topHeaders, _i, _len;
      document.body.style.display = 'none';
      document.title = title;
      navBtnSkeleton = menuBySel ? '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>' : '';
      navSkeleton = '<nav class="navbar navbar-' + menuMode + ' navbar-fixed-top" style="-webkit-backface-visibility:hidden"><div class="container"><div class="navbar-header">' + navBtnSkeleton + '<a class="navbar-brand" href="#">' + title + '</a></div></div></nav>';
      metaCharset = document.createElement('meta');
      metaCharset.setAttribute('charset', 'utf-8');
      document.head.appendChild(metaCharset);
      metaIe = document.createElement('meta');
      metaIe.setAttribute('http-equiv', 'X-UA-Compatible');
      metaIe.setAttribute('content', 'IE=edge');
      document.head.appendChild(metaIe);
      metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.setAttribute('content', 'width=device-width, initial-scale-1');
      document.head.appendChild(metaViewport);
      if (favicon) {
        linkFav = document.createElement('link');
        linkFav.rel = 'icon';
        linkFav.href = favicon;
        document.head.appendChild(linkFav);
      }
      linkCss = document.createElement('link');
      linkCss.rel = 'stylesheet';
      linkCss.type = 'text/css';
      linkCss.href = themeCss;
      document.head.appendChild(linkCss);
      document.body.style.paddingTop = '3em';
      document.body.innerHTML = navSkeleton + "<div class=container>" + htmlContent + "</div>";
      if (menuBySel) {
        jqScript = document.createElement('script');
        jqScript.src = proto + "//code.jquery.com/jquery-" + jqVersion + ".min.js";
        bsScript = document.createElement('script');
        bsScript.type = jqScript.type = 'text/javascript';
        bsScript.src = proto + "//maxcdn.bootstrapcdn.com/bootstrap/" + bootstrapVersion + "/js/bootstrap.min.js";
        jqScript.onload = function() {
          return document.documentElement.appendChild(bsScript);
        };
        document.documentElement.appendChild(jqScript);
        collectMenus(menuBySel);
      }
      topHeaders = headerEmpSel != null ? qSA(headerEmpSel) : false;
      if (topHeaders && topHeaders.length) {
        for (_i = 0, _len = topHeaders.length; _i < _len; _i++) {
          el = topHeaders[_i];
          el.outerHTML = '<header class="page-header">' + el.outerHTML + '</header>';
        }
      } else {
        document.body.style.paddingTop = '5em';
      }
      return document.body.style.display = '';
    };
    mdChecksumKey = 'sitemark' + mdHash(mdContent);
    if (self.localStorage.getItem(mdChecksumKey)) {
      return visualize(self.localStorage.getItem(mdChecksumKey));
    } else {
      return mdRender(mdContent, function(htmlContent) {
        var oldKey;
        oldKey = self.localStorage.getItem('currentChecksumKey');
        if (oldKey) {
          self.localStorage.removeItem(oldKey);
        }
        self.localStorage.setItem('currentChecksumKey', mdChecksumKey);
        self.localStorage.setItem(mdChecksumKey, htmlContent);
        return visualize(htmlContent);
      });
    }
  };

  addEventListener('DOMContentLoaded', function() {
    var favicon, mdContent, menuBySel, menuMode, rootEl, themeName;
    rootEl = qS('[data-root]');
    if (!rootEl) {
      rootEl = qS(rootSel);
    }
    mdContent = rootEl.tagName.toLowerCase() === 'textarea' ? rootEl.defaultValue : rootEl.innerHTML;
    themeName = rootEl.hasAttribute('data-theme') ? rootEl.getAttribute('data-theme') : false;
    menuBySel = rootEl.hasAttribute('data-menu-by') ? rootEl.getAttribute('data-menu-by') : false;
    menuMode = rootEl.hasAttribute('data-menu-mode') ? rootEl.getAttribute('data-menu-mode') : 'default';
    favicon = rootEl.hasAttribute('data-fav') ? rootEl.getAttribute('data-fav') : false;
    rootEl.parentNode.removeChild(rootEl);
    return htmlRender(document.title, mdContent, themeName, menuBySel, menuMode, favicon);
  }, false);

}).call(this);
