---
layout: post
title: Dynamically Adding Styles to HTML Pages
created: 1312092000
author: gabi
permalink: /dynamically-adding-styles-html-pages
---
I came into a situation where I needed to apply styles to the entire page after the page was loaded. Using techniques like targeting elements by their CSS selectors and applying styles to them with jQuery or similar tools would not be sufficient, because I would have to do it every time elements are added to the DOM and it would have required specifically adding a class (or some other attribute) to each element I wanted to apply the style to.<br /><br />The solution I ended up implementing was to add styles to the page dynamically using JavaScript. Normal browsers let you manipulate the Head element as any other element, so all I needed to do was to append the Style element as a child of the Head element, and set the style's inner HTML with the CSS content:<br /><br /><pre class="brush: js">function addCustomStyle() {<br />   var style = document.createElement("style");<br />   style.innerHTML = ".someclass {color: green;}";<br />   var head = document.getElementsByTagName("head")[0];<br />   head.appendChild(style);<br />}</pre><br />Unsurprisingly like so many other cases, Internet Explorer has its own way of doing stuff. It doesn't allow manipulating the Head element as other elements, but it does provide an API for adding CSS rules to the document. Here is how it's done:<br /><br /><pre class="brush: js">function addCustomStyle() {<br />   var style = document.createStyleSheet();<br />   style.addRule(".someclass", "color: green;");<br />}</pre><br />You could wrap the two methods with IE conditional tags ([if !IE] and [if IE]) so only one of them will actually be used depending on the browser, or you can come up with your own mechanism. If you are using GWT, deferred binding is perfect for this.