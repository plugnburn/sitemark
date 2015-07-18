!function(w){
	var Landmark = (function(){
		var esc=function(s){
        	s = s.replace(/\&/g, '&amp;')
	        var escChars = '\'#<>`*-~_=:"![]()nt',c,l=escChars.length,i
    	    for(i=0;i<l;i++) s=s.replace(RegExp('\\'+escChars[i], 'g'), function(m){return'&#'+m.charCodeAt(0)+';'})
        	return s
	    }, rules = [
			{p:/\r\n/g, r:'\n'},
	        {p:/\n\s*```\n([^]*?)\n\s*```\s*\n/g, r:function(m,grp){return'<pre>'+esc(grp)+'</pre>'}},
    	    {p:/`(.*?)`/g, r:function(m,grp){return'<code>'+esc(grp)+'</code>'}},
	        {p:/\n\s*(#+)(.*?)/g, r:function(m,hset,hval){m=hset.length;return'<h'+m+'>'+hval.trim()+'</h'+m+'>'}},
	        {p:/\n\s*(.*?)\n={3,}\n/g, r:'\n<h1>$1</h1>\n'},
	        {p:/\n\s*(.*?)\n-{3,}\n/g, r:'\n<h2>$1</h2>\n'},
			{p:/___(.*?)___/g, r:'<u>$1</u>'},
	        {p:/(\*\*|__)(.*?)\1/g, r:'<strong>$2</strong>'},
	        {p:/(\*|_)(.*?)\1/g, r:'<em>$2</em>'},
    	    {p:/~~(.*?)~~/g, r:'<del>$1</del>'},
        	{p:/:"(.*?)":/g, r:'<q>$1</q>'},
	        {p:/\!\[([^\[]+?)\]\s*\(([^\)]+?)\)/g, r:'<img src="$2" alt="$1">'},
	        {p:/\[([^\[]+?)\]\s*\(([^\)]+?)\)/g, r:'<a href="$2">$1</a>'},
	        {p:/\n\s*(\*|\-)\s*([^\n]*)/g, r:'\n<ul><li>$2</li></ul>'},
    	    {p:/\n\s*\d+\.\s*([^\n]*)/g, r:'\n<ol><li>$1</li></ol>'},
	        {p:/\n\s*(\>|&gt;)\s*([^\n]*)/g, r:'\n<blockquote>$2</blockquote>'},
	        {p:/<\/(ul|ol|blockquote)>\s*<\1>/g, r: ' '},
	        {p:/\n\s*\*{5,}\s*\n/g, r:'\n<hr>'},
			{p:/\n{3,}/g, r:'\n\n'},
	        {p:/\n([^\n]+)\n/g, r:function(m, grp){grp=grp.trim();return /^\<\/?(ul|ol|bl|h\d|p).*/.test(grp.slice(0,9)) ? grp : ('<p>'+grp+'</p>')}},
	        {p:/>\s+</g, r:'><'}
	    ], l = rules.length, i		
		return function(text) {
            if(text = text || '') {
				text = '\n' + text.trim() + '\n'
                for(var i=0;i<l;i++) text = text.replace(rules[i].p, rules[i].r)
			}
            return text
        }
	})(), 
	
	rootSel = 'xmp',
	bootstrapVersion = '3.3.4',
	jqVersion = '2.1.3',
	
	D = w.document,
	proto = (w.location.protocol === 'https:' ? 'https:' : 'http:'),
	headerEmpSel = 'h1',
	qS = function(s){return D.querySelector(s)},
	qSA = function(s){return D.querySelectorAll(s)},
	
	htmlRender = function(title, htmlContent, themeName, menuBySel, menuMode, favicon) {
		D.body.style.cssText='display:none;padding-top:3em'
		D.title = title

		var collectMenus = function(menuBySel) {
			var targetElements = qSA(menuBySel)
			if(targetElements.length) {
				var i, el, elVal, elId, elAnchor, navElement = '<div id=navbar class="navbar-collapse collapse"><ul class="nav navbar-nav">'
				for(i=0;i<targetElements.length;i++) {
					el = targetElements[i]
					elVal = el.textContent.trim()
					elId = elVal.trim().toLowerCase().split(/\s+/g).join('-')
					elAnchor = D.createElement('span')
					elAnchor.style.cssText = 'position:absolute;display:inline-block;height:0;width:0;visibility:hidden;top:-2em'
					elAnchor.id = elId
					el.id = 'heading-'+elId
					el.style.position = 'relative'
					el.appendChild(elAnchor)
					navElement += '<li><a href="#'+elId+'">'+elVal+'</a></li>'
				}
				navElement += '</ul></div>'
				qS('nav.navbar>div.container').insertAdjacentHTML('beforeend', navElement)
			}
			else {
				var navBtn = qS('nav.navbar button.navbar-toggle')
				if(navBtn) navBtn.outerHTML=''
			}
		},
		navBtnSkeleton = (menuBySel ? '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>' : ''),
		navSkeleton = '<nav class="navbar navbar-' + menuMode + ' navbar-fixed-top" style="-webkit-backface-visibility:hidden"><div class="container"><div class="navbar-header">' + navBtnSkeleton + '<a class="navbar-brand" href="#">' + title + '</a></div></div></nav>',
		metaCharset = D.createElement('meta'), metaIe = D.createElement('meta'), metaViewport = D.createElement('meta'), linkCss = D.createElement('link')

		metaCharset.setAttribute('charset', 'utf-8')
		D.head.appendChild(metaCharset)
		metaIe.setAttribute('http-equiv', 'X-UA-Compatible')
		metaIe.setAttribute('content', 'IE=edge')
		D.head.appendChild(metaIe)
		metaViewport.name = 'viewport'
		metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no')
		D.head.appendChild(metaViewport)

		if(favicon) {
			var linkFav = D.createElement('link')
			linkFav.rel = 'icon'
			linkFav.href = favicon
			D.head.appendChild(linkFav)
		}

		linkCss.rel = 'stylesheet'
		linkCss.type = 'text/css'
		linkCss.href = proto + '//maxcdn.bootstrapcdn.com/' + (
            themeName ? 'bootswatch/'+bootstrapVersion+'/'+themeName+'/bootstrap.min.css'
            : 'bootstrap/'+bootstrapVersion+'/css/bootstrap.min.css'
        )
		D.head.appendChild(linkCss)
		D.body.innerHTML = navSkeleton + '<div class=container>' + htmlContent + '</div>'
		if(menuBySel) {
			var jqScript = D.createElement('script'), bsScript = D.createElement('script')
			jqScript.src = proto+'//code.jquery.com/jquery-'+jqVersion+'.min.js'
			jqScript.type = bsScript.type = 'text/javascript'
			bsScript.src = proto+'//maxcdn.bootstrapcdn.com/bootstrap/'+bootstrapVersion+'/js/bootstrap.min.js'
			jqScript.onload = function() {
				D.documentElement.appendChild(bsScript)
			}
			D.documentElement.appendChild(jqScript)
			collectMenus(menuBySel)
		}
		var topHeaders = headerEmpSel != null ? qSA(headerEmpSel) : false
		if(topHeaders && topHeaders.length) {
			for(var i=0, l=topHeaders.length;i<l;i++)
				topHeaders[i].outerHTML = '<header class="page-header">' + topHeaders[i].outerHTML + '</header>'
		}
		else D.body.style.paddingTop = '5em'
		D.body.style.display = ''
	}

	w.addEventListener('DOMContentLoaded', function(){
		var rootEl = qS('[data-root]') || qS(rootSel),
			mdContent = (rootEl.tagName.toLowerCase() === 'textarea' ? rootEl.defaultValue : rootEl.innerHTML),
			themeName = (rootEl.hasAttribute('data-theme') ? rootEl.getAttribute('data-theme') : false),
			menuBySel = (rootEl.hasAttribute('data-menu-by') ? rootEl.getAttribute('data-menu-by') : false),
			menuMode = (rootEl.hasAttribute('data-menu-mode') ? rootEl.getAttribute('data-menu-mode') : 'default'),
			favicon = (rootEl.hasAttribute('data-fav') ? rootEl.getAttribute('data-fav') : false)
		rootEl.parentNode.removeChild(rootEl)
		htmlRender(D.title, Landmark(mdContent), themeName, menuBySel, menuMode, favicon)
	})

}(this)
