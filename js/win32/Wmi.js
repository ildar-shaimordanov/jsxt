
//
// JavaScript unit
// Add-on for WMI
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

/*

// 1. Traditional call


// 1.1. Select all processes. 
var wbemService = GetObject('WinMgmts:');
var processes = wbemService.ExecQuery('SELECT * FROM Win32_Process');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 1.2. Select all "svchost.exe" processes. 
var wbemService = GetObject('WinMgmts:');
var processes = wbemService.ExecQuery('SELECT * FROM Win32_Process WHERE Name = "svchost.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2. New way. 


// 2.1. Dynamic call. 


// 2.1.1. Select all processes. 
var wmi = new Wmi();
var processes = wmi.exec('Win32_Process');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.1.2. Select all "svchost.exe" processes. 
var wmi = new Wmi();
var processes = wmi.exec('Win32_Process', 'Name = "svchost.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.2. Static call. 


// 2.2.1. Select all processes. Static call. 
var processes = Wmi.exec('Win32_Process');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.2.2. Select all "svchost.exe" processes. 
var processes = Wmi.exec('Win32_Process', 'Name = "svchost.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.3. Syntax sugar call. 


// 2.3.1. Select all processes. 
var wmi = new Wmi({
    extendSubclasses: 1
});
var processes = wmi.Win32_Process();
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.3.2. Select all "svchost.exe" processes. Syntax sugar call. 
var wmi = new Wmi({
    extendSubclasses: 1
});
var processes = wmi.Win32_Process('Name = "svchost.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.4. Another examples. 


// 2.4.1. Select all services
var wmi = new Wmi({
    extendSubclasses: 1
});
var services = wmi.Win32_Service();
for (var fc = new Enumerator(services); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name);
}


// 2.4.2. Select operating system information
var wmi = new Wmi({
    extendSubclasses: 1
});
var os = wmi.Win32_OperatingSystem();
for (var fc = new Enumerator(os); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo('Caption: ' + p.Caption);
    WScript.Echo('Build numer: ' + p.BuildNumber);
    WScript.Echo('Version: ' + p.Version);
    WScript.Echo('Name: ' + p.Name);
    WScript.Echo('CSDVersion: ' + p.CSDVersion);
    WScript.Echo('ServicePackMajorVersion: ' + p.ServicePackMajorVersion);
    WScript.Echo('ServicePackMinorVersion: ' + p.ServicePackMinorVersion);
}

*/

function Wmi(params)
{
	params = params || {};

	var self = this;

	self.service = null;

	if ( params instanceof ActiveXObject ) {
		self.service = params;
	} else if ( params instanceof Wmi ) {
		self.service = params.service;
	} else if ( params instanceof String || params.moniker ) {
		self.service = GetObject(params || params.moniker);
	} else if ( params.user ) {
		self.service = Wmi.connectServer(params);
	} else {
		var moniker = Wmi.getMoniker(params);
		self.service = GetObject(moniker);
	}

	if ( params.extendSubclasses ) {
		Wmi.extendSubclasses(self);
	}
};

Wmi.connectServer = function(params)
{
	params = params || {};

	var swbemLocator = new ActiveXObject('WbemScripting.SWbemLocaltor');
	if ( params.impersonationLevel ) {
		swbemLocator.Security_.ImpersonationLevel = params.impersonationLevel;
	}
	if ( params.authenticationLevel ) {
		swbemLocator.Security_.AuthenticationLevel = params.authenticationLevel;
	}
	if ( params.privileges ) {
		for (var i = 0; i < params.privileges.length; i++) {
			var v = params.privileges[i];
			var p = 'Se' + v.replace(/^\s*!/, '') + 'Privilege';
			var f = ! v.match(/^\s*!/);
			swbemLocator.Security_.Privileges.AddAsString(p, f);
		}
	}
	return swbemLocator.ConnectServer(
		params.computer, 
		params.namespace, 
		params.user, 
		params.password, 
		params.locale, 
		params.authority, 
		params.securityFlag, 
		params.wbemNamedValueSet);
};

Wmi.getMoniker = function(params)
{
	params = params || {};

	var security = [];
	if ( params.impersonationLevel ) {
		security.push('impersonationLevel=' + params.impersonationLevel);
	}
	if ( params.authenticationLevel ) {
		security.push('authenticationLevel=' + params.authenticationLevel);
	}
	if ( params.authority && params.computer ) {
		security.push('authority=' + params.authority);
	}
	if ( params.privileges ) {
		security.push('(' + params.privileges.join(', ') + ')');
	}

	var moniker = ['WinMgmts:'];
	if ( security.length ) {
		moniker.push('{' + security.join(',') + '}');
	}
	if ( params.locale ) {
		moniker.push('[locale=' + params.locale + ']');
	}
	if ( ( security.length || params.locale ) && params.computer ) {
		moniker.push('!');
	}
	if ( params.computer ) {
		moniker.push('\\\\' + params.computer);
	}
	if ( params.namespace ) {
		moniker.push('\\' + params.namespace);
	}
	if ( params.className ) {
		moniker.push(':' + params.className);
	}

	return moniker.join('');
};

Wmi.extendSubclasses = function(instance)
{
	var classNames = instance.service.SubclassesOf();

	for (var fc = new Enumerator(classNames); ! fc.atEnd(); fc.moveNext()) {
		var p = fc.item();
		(function()
		{
			var className = p.Path_.Class;
			if ( instance[className] ) {
				return;
			}

			instance[className] = function(whereClause)
			{
				return Wmi.exec(className, whereClause, instance.service);
			};
		})();
	}
};

Wmi.prepare = function(className, whereClause)
{
	var query = 'SELECT * FROM ' + className;
	if ( whereClause ) {
		whereClause = [].concat(whereClause).join(') AND (');
		query += ' WHERE (' + whereClause + ')';
	}
	return query;
};

Wmi.prototype.get = function(path)
{
	return this.service.Get(path);
};

Wmi.prototype.execQuery = function(query)
{
	return this.service.ExecQuery(query);
};

Wmi.prototype.execMethod = function(path, methodName, inParams)
{
	var objClass = this.get(path);
	var objParams = null;
	if ( inParams ) {
		objParams = objClass.Methods_(methodName).InParameters.SpawnInstance_();
		for (var p in inParams) {
			if ( ! inParams.hasOwnProeprty(p) ) {
				continue;
			}
			objParams.Properties_.Item(p) = inParams[p];
		}
	}
	return this.service.ExecMethod(path, methodName, objParams);
};

Wmi.prototype.exec = function(className, whereClause)
{
	var query = Wmi.prepare(className, whereClause);
	return this.execQuery(query);
};

Wmi.get = function(path, params)
{
	var wmi = new Wmi(params);
	return wmi.get(path);
};

Wmi.execQuery = function(query, params)
{
	var wmi = new Wmi(params);
	return wmi.execQuery(query);
};

Wmi.execMethod = function(path, methodName, inParams, params)
{
	var wmi = new Wmi(params);
	return wmi.execMethod(path, methodName, inParams);
};

Wmi.exec = function(className, whereClause, params)
{
	var wmi = new Wmi(params);
	return wmi.exec(className, whereClause);
};

