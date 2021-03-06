---
layout: post
title: Criticisms of Spring, PHP, and Rails
created: 1210804680
author: zvika
permalink: /java/criticisms-spring-php-and-rails
tags:
- JAVA
---
<p><span class="thmr_call" id="thmr_42"><span class="thmr_call" id="thmr_6"><h4>Spring is huge.</h4>  <p>The unzipped distribution is over 150 Meg. Spring is not a single framework. Rather, it's more of a collection of independent tools, with its Dependency Injection framework as the core item.</p><p>Some immediate consequences of this large size :</p><ul><li>it's <b>complex</b>.</li><li>it has <b>no clear focus</b>. It includes &quot;everything and the kitchen sink&quot;.</li><li>its javadoc has <b>over 2400 classes</b>.</li><li>its <tt>lib</tt> directory contains <b>49 other tools</b>, totaling <b>82 jars</b>. It's true that an application would never use them all, but this clearly has non-trivial consequences. It would be difficult to find any other tool having so many dependencies.</li><li>it takes significant time to learn about all of its parts. Even if you don't use them, you will likely need to learn at least something about all its parts, just to see what they are about.</li><li>Joshua Bloch's dictum of <em>&quot;when in doubt, leave it out&quot;</em> doesn't seem to have been applied to this tool with any enthusiasm.</li></ul></span></span></p>
