//
// Mail.js
// Extension to simplify sending of e-mails via CDO.Message
//
// Copyright (c) 2012 by Ildar Shaimordanov
//

/*

Mail.js is JScript extension to send e-mails from your scripts. Actually 
it is wrapper over the CDO.Message component and simplifies its usage. 

Most of configurable parameters are hidden within appropriate methods that 
are suggested to be called instead direct usage of these parameters. 

Almost all parameters are provided using a single argument that is being 
an object. This allows to pass them arbitrarily, with no worry of their 
actual order. 

Constructor
===========

Mail(options)

Creates CDO.Message and stores it in the Mail.driver property. Also it 
provides some configurable parameters calling its method Mail.configure(). 
Learn more about possible parameters from the description of the 
Mail.configure(). 


Properties
==========

Mail.driver

http://msdn.microsoft.com/en-us/library/ms526453%28v=exchg.10%29.aspx

The ActiveX object keeps the reference to CDO.Message component. 


Methods
=======

Mail.configure(options)

Configures once created CDO.Message object. Internally each configurable 
parameter corresponds to a field used to set configurations for the 
Configuration.Fields of the CDO.Message object stored in Mail.driver. 

There is short list of the most useful parameters below. Commonly all 
details are copied and pasted from the appropriate pages of MSDN. The 
complete list of fields is available from these pages

http://msdn.microsoft.com/en-us/library/ms870486%28v=exchg.65%29
http://msdn.microsoft.com/en-us/library/ms872853%28v=exchg.65%29

	sendusing

	http://msdn.microsoft.com/en-us/library/ms873037%28v=exchg.65%29

	The mechanism to use to send messages. 
	If the SMTP service is installed on the local computer, then the 
	value defaults to 1. Otherwise, if Microsoft Outlook Express is 
	installed, the value defaults to 2 and the settings from the 
	default account are used. 
	1 - Send the message using the local SMTP service pickup 
	directory.
	2 - Send the message using the network ( SMTP over the network).
	3 - Send the message using the Microsoft Exchange mail submission 
	Uniform Resource Identifier (URI). This URI is found in the user's 
	urn:schemas:httpmail:sendmsg mailbox folder property.


	smtpusessl

	http://msdn.microsoft.com/en-us/library/ms873053%28v=exchg.65%29

	A boolean value indicating whether Secure Sockets Layer (SSL) 
	should be used when posting messages over the network using the 
	SMTP protocol.


	smtpauthenticate

	http://msdn.microsoft.com/en-us/library/ms873042%28v=exchg.65%29

	The authentication mechanism to use when authenticating to a SMTP 
	service over the network.

	With this you specify what authentication mechanism (if any) is 
	used to perform authentication with a SMTP service when sending 
	messages over the network. 
	0 - Perform no authentication.
	1 - Use the basic (clear text) authentication mechanism.
	2 - Use the NTLM authentication mechanism.


	smtpserver

	http://msdn.microsoft.com/en-us/library/ms873046%28v=exchg.65%29

	The Domain Name System (DNS) or Network Basic Input/Output System 
	(NetBIOS) name of the host to which to post messages using the 
	SMTP protocol.


	smtpserverport

	http://msdn.microsoft.com/en-us/library/ms873051%28v=exchg.65%29

	The port on which the SMTP service is listening.The default is 25. 


	sendusername

	http://msdn.microsoft.com/en-us/library/ms873032%28v=exchg.65%29

	The username used in conjunction with the sendpassword field when 
	authenticating to a SMTP or Microsoft Exchange HTTP service over 
	the network.


	sendpassword

	http://msdn.microsoft.com/en-us/library/ms873029%28v=exchg.65%29

	The password used in conjunction with the sendusername field when 
	authenticating to a SMTP or Microsoft Exchange WebDAV service over 
	the network.


Mail.setMailHeaders(options)

http://msdn.microsoft.com/en-us/library/aa566465%28v=exchg.80%29.aspx

Sets fields that contain Internet standard message header values. Follow 
the link above for details. There is short list of the most useful 
headers. 

	content-type

	http://msdn.microsoft.com/en-us/library/aa564332%28v=exchg.80%29

	The body part content type. Example: 
	text/plain; charset="iso-8859-1"


	disposition-notification-to

	http://msdn.microsoft.com/en-us/library/aa580255%28v=exchg.80%29

	Where disposition notifications should be sent.


	importance

	http://msdn.microsoft.com/en-us/library/aa562949%28v=exchg.80%29

	Indicates the level of importance for a message as either low, 
	normal, or high.


	return-receipt-to

	http://msdn.microsoft.com/en-us/library/aa580544%28v=exchg.80%29

	The address to which return receipts should be sent.


	x-mailer

	http://msdn.microsoft.com/en-us/library/aa580804%28v=exchg.80%29

	The name of the software used to send the message. 


Mail.addAttachment(URL, mimetype, options)

http://msdn.microsoft.com/en-us/library/ms526983(v=exchg.10).aspx

Adds an attachment to the message. There are arguments:

	URL
	The full path and file name of the message to be attached to this 
	message. 

	mimetype
	The content type if it is required. 

	options
	This argument contains two fields - username and password. They 
	should be defined to use for authentication when retrieving the 
	resource using Hypertext Tranfer Protocol (HTTP). Can be used to 
	set the credentials for both the basic and NTLM authentication 
	mechanisms. 


Mail.prepareMessage(options)

http://msdn.microsoft.com/en-us/library/aa566465%28v=exchg.80%29.aspx

Prepares the message to send off. The most important parameters are 

	From

	http://msdn.microsoft.com/en-us/library/ms527318%28v=exchg.10%29.aspx

	This is mandatory paramter. It lists the e-mail addresses of the 
	principal author or authors of this message. 


	To

	http://msdn.microsoft.com/en-us/library/ms527328%28v=exchg.10%29.aspx

	The To property specifies the principal (To) recipients for the 
	message.


	Cc

	http://msdn.microsoft.com/en-us/library/ms527268%28v=exchg.10%29.aspx

	The CC property specifies the secondary (Cc) recipients for this 
	message.


	Bcc

	http://msdn.microsoft.com/en-us/library/ms527351%28v=exchg.10%29.aspx

	The BCC property specifies the blind carbon copy (Bcc) recipients 
	for this message.


	Subject

	http://msdn.microsoft.com/en-us/library/ms527248%28v=exchg.10%29.aspx

	The Subject property specifies the subject of the message. The 
	default value of the Subject property is an empty string. 


	TextBody

	http://msdn.microsoft.com/en-us/library/ms526935%28v=exchg.10%29.aspx

	The TextBody property specifies the plain text representation of 
	the message. The default value of the TextBody property is an 
	empty string. 


Mail.send(options)

http://msdn.microsoft.com/en-us/library/ms526482%28v=exchg.10%29.aspx

Prepares and sends the message. How the message is prepared see the 
Mail.prepareMessage() method. 


Mail.MailRu(options)
Mail.Yandex(options)
Mail.GMail(options)

Thre are three useful wrappers around Mail.Ru, Yandex, and GMail email 
services that are the most popular in Russia. All of them use the same 
configure parameters: 

sendusing = 2;
smtpusessl = true;
smtpauthenticate = 1;

They use their own smtpserver and smtpserverport to connect to. So all 
these parameters are hidden within these wrappers. Only mandatory 
sendusername and sendpasword should be provided explicitly as it is shown 
below. Be noticed that you should provide the full username in the form 
login@hostname for Mail.Ru and GMail. Whereas for Yandex you should 
provide the short username as login, without the following part 
'@hostname'. 

// Mail.Ru
var mailer = new Mail.MailRu({
	sendusername: 'login@mail.ru', 
	sendpassword: 'password'
});

// Yandex
var mailer = new Mail.Yandex({
	sendusername: 'login', 
	sendpassword: 'password'
});

// GMail
var mailer = new Mail.GMail({
	sendusername: 'login@gmail.com', 
	sendpassword: 'password'
});

*/


function Mail(options)
{
	this.driver = new ActiveXObject('CDO.Message');
	this.configure(options);
};

(function()
{

var fieldsUpdate = function(fields, prefix, options)
{
	for (var p in options) {
		if ( ! p || ! options.hasOwnProperty(p) ) {
			continue;
		}
		fields.Item(prefix + p) = options[p];
	}

	fields.Update();
};

Mail.prototype.configure = function(options)
{
	fieldsUpdate(
		this.driver.Configuration.Fields, 
		'http://schemas.microsoft.com/cdo/configuration/', 
		options);
};

Mail.prototype.setMailHeaders = function(options)
{
	fieldsUpdate(
		this.driver.Fields, 
		'urn:schemas:mailheader:', 
		options);
};

Mail.prototype.addAttachment = function(URL, mimetype, options)
{
	options = options || {};
	var attachment = this.driver.AddAttachment(URL, options.username, options.password);
	if ( mimetype ) {
		attachment.ContentMediaType = mimtype;
	}
};

Mail.prototype.prepareMessage = function(options)
{
	var driver = this.driver;

	for (var p in options) {
		if ( ! p || ! options.hasOwnProperty(p) ) {
			continue;
		}
		driver[p] = options[p];
	}
};

Mail.prototype.send = function(options)
{
	this.prepareMessage(options);
	this.driver.Send();
};

var prepareSmtpOptions = function(options, host, port)
{
	options = options || {};
	options.sendusing = 2;
	options.smtpusessl = true;
	options.smtpauthenticate = 1;
	options.smtpserver = host;
	options.smtpserverport = port;
	return options;
};

Mail.MailRu = function(options)
{
	return new Mail(prepareSmtpOptions(options, 'smtp.mail.ru', 25));
};

Mail.Yandex = function(options)
{
	return new Mail(prepareSmtpOptions(options, 'smtp.yandex.ru', 465));
};

Mail.GMail = function(options)
{
	return new Mail(prepareSmtpOptions(options, 'smtp.gmail.com', 465));
};

})();

