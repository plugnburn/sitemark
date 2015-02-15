# Sitemark library

mdEndpoint = 'https://api.github.com/markdown/raw'
rootSel = 'xmp'
bootstrapVersion = '3.3.2'
jqVersion = '2.1.3'
proto = if location.protocol isnt 'https:' then 'http:'
headerEmpSel = 'h1'

qS = (s) -> document.querySelector s
qSA = (s) -> document.querySelectorAll s

mdRender = (md, cb) ->
	xhr = new XMLHttpRequest
	xhr.open 'POST', mdEndpoint, true
	xhr.setRequestHeader 'content-Type', 'text/plain'
	xhr.onload = ->
		cb xhr.responseText if xhr.status is 200
	xhr.send md

mdHash = (s) ->
	hash = 0
	hash = s.charCodeAt(i) + (hash<<6) + (hash<<16) - hash for c,i in s
	hash>>>0

getAlias = (s) -> s.trim().toLowerCase().split(/\s+/g).join('-')

htmlRender = (title, mdContent, themeName, menuBySel, menuMode, favicon) ->
	themeCss = "#{proto}//maxcdn.bootstrapcdn.com/"
	if themeName
		themeCss += "bootswatch/#{bootstrapVersion}/#{themeName}/bootstrap.min.css"
	else
		themeCss += "bootstrap/#{bootstrapVersion}/css/bootstrap.min.css"
	
	collectMenus = (menuBySel) ->
		targetElements = qSA menuBySel
		if targetElements.length
			navContainer = document.querySelector 'nav.navbar>div.container'
			navElement = '<div id=navbar class="navbar-collapse collapse"><ul class="nav navbar-nav">'
			for el in targetElements
				elVal = el.textContent.trim()
				elId = getAlias elVal
				elAnchor = document.createElement 'span'
				elAnchor.style.position = 'absolute'
				elAnchor.style.display = 'inline-block'
				elAnchor.style.height = elAnchor.style.width = '0px'
				elAnchor.style.visibility = 'hidden'
				elAnchor.style.top = '-2em'
				elAnchor.id = elId
				el.id = "heading-#{elId}"
				el.style.position = 'relative'
				el.appendChild elAnchor
				navElement += "<li><a href=\"##{elId}\">#{elVal}</a></li>"
			navElement += '</ul></div>'
			navContainer.insertAdjacentHTML 'beforeend', navElement
		else
			navBtn = qS 'nav.navbar button.navbar-toggle'
			navBtn.parentNode.removeChild navBtn
	
	visualize = (htmlContent) ->
		document.body.style.display = 'none'
		navBtnSkeleton = if menuBySel then '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>' else ''
		navSkeleton = '<nav class="navbar navbar-' + menuMode + ' navbar-fixed-top"><div class="container"><div class="navbar-header">' + navBtnSkeleton + '<a class="navbar-brand" href="#">' + title + '</a></div></div></nav>'
		headContent = '<meta charset=utf-8><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name=viewport content="width=device-width, initial-scale=1">'
		headContent += "<link rel=icon href=\"#{favicon}\">" if favicon
		headContent += "<title>#{title}</title><link rel=stylesheet type=\"text/css\" href=\"#{themeCss}\">"
		document.head.insertAdjacentHTML 'afterbegin', headContent
		document.body.style.paddingTop = '3em'
		document.body.innerHTML = "#{navSkeleton}<div class=container>#{htmlContent}</div>"
		if menuBySel
			jqScript = document.createElement 'script'
			jqScript.src = "#{proto}//code.jquery.com/jquery-#{jqVersion}.min.js"
			bsScript = document.createElement 'script'
			bsScript.type = jqScript.type = 'text/javascript'
			bsScript.src = "#{proto}//maxcdn.bootstrapcdn.com/bootstrap/#{bootstrapVersion}/js/bootstrap.min.js"
			jqScript.onload = -> document.documentElement.appendChild bsScript
			document.documentElement.appendChild jqScript
			collectMenus menuBySel
		topHeaders = if headerEmpSel? then qSA headerEmpSel else false
		if topHeaders and topHeaders.length
			for el in topHeaders
				el.outerHTML = '<header class="page-header">' + el.outerHTML + '</header>'
		else
			document.body.style.paddingTop = '5em'
		document.body.style.display = ''
	
	mdChecksumKey = 'sitemark' + mdHash(mdContent)

	if self.localStorage.getItem(mdChecksumKey)
		visualize self.localStorage.getItem(mdChecksumKey)
	else
		mdRender mdContent, (htmlContent)->
			oldKey = self.localStorage.getItem 'currentChecksumKey'
			self.localStorage.removeItem(oldKey) if oldKey
			self.localStorage.setItem 'currentChecksumKey', mdChecksumKey
			self.localStorage.setItem mdChecksumKey, htmlContent
			visualize htmlContent

addEventListener 'DOMContentLoaded', ->
	rootEl = qS '[data-root]'
	if !rootEl
		rootEl = qS rootSel
	mdContent = if rootEl.tagName.toLowerCase() is 'textarea' then rootEl.defaultValue else rootEl.innerHTML
	themeName = if rootEl.hasAttribute('data-theme') then rootEl.getAttribute('data-theme') else false
	menuBySel = if rootEl.hasAttribute('data-menu-by') then rootEl.getAttribute('data-menu-by') else false
	menuMode = if rootEl.hasAttribute('data-menu-mode') then rootEl.getAttribute('data-menu-mode') else 'default'
	favicon = if rootEl.hasAttribute('data-fav') then rootEl.getAttribute('data-fav') else false
	rootEl.parentNode.removeChild rootEl
	htmlRender document.title, mdContent, themeName, menuBySel, menuMode, favicon
, false