---
layout: post
title: 'Bypassing the login screen on web applications hosted on Tomcat or JBoss '
created: 1209029820
permalink: bypassing-the-login-screen-on-web-applications-hosted-on-tomcat-or-jboss
tags:
- JAVA
- valve
---
<p>&nbsp;</p><p>The attached code will allow you to provide links to your password protected web application screens that will not require to go through login page, as long as the correct credentials will be provided in the URL. The implementation is based on Tomcats valves.</p> <p>&nbsp;Tomcat valves are similar to servlet filters in that they can be used to pre-process request objects. However, unlike filters, which are server-independent, valves are <strong>proprietary to Tomcat</strong>. Also, valves are only inserted in the request-processing pipeline and therefore cannot be used to modify response objects.&nbsp; <br />The use of valve is required because the login process is executed before any of the filters <br />&nbsp;<br />The following valve allows external applications that would like to launch the web GUI to skip the login page, as long as they provides the correct credentials in the URL as parameters named: j_username, j_password. <br />In order to make it work you should compile and pack the enclosed <strong>AuthenticatorValve.java</strong> file into a jar and placed it under&nbsp;</p> <p><strong>For JBoss</strong><br />jboss/server/default/deploy/jbossweb-tomcat50.sar/ <br /><strong>For Tomcat </strong><br />$CATALINA_HOME/server/lib/</p> <p>The file <strong>context.xml</strong> should be placed under you war WEB-INF directory <br />For more information see the Tomcat documentation.</p> <p>&nbsp;</p><p>P.S. -&nbsp; I would like to give the credits to this solution to Zvika that provided the code when I needed to solve this issue</p>
