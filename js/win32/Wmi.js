
//
// JavaScript unit
// Add-on for WMI
//
// Copyright (c) 2010 by Ildar Shaimordanov
//

/*

var wmi = new Wmi();

var processes = wmi.exec('Win32_Process', 'Name="cmd.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Handle, p.Name, p.commandLine);
}

var wmi = new Wmi({
    extendSubclasses: 1
});

WScript.Echo('==== Processes ====');
var processes = wmi.Win32_Process('Name = "cmd.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Handle, p.Name, p.commandLine);
}

WScript.Echo('==== Services ====');
var services = wmi.Win32_Service('Name LIKE "%Server"');
for (var fc = new Enumerator(services); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name);
}

WScript.Echo('==== Operating System ====');
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

	if ( params instanceof Wmi || params.wmi ) {
		self.service = params || params.wmi;
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
				var query = Wmi.prepare(className, whereClause);
				return instance.service.ExecQuery(query);
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

Wmi.execQuery = function(query, params)
{
	var wmi = new Wmi(params);
	return wmi.service.ExecQuery(query);
};

Wmi.exec = function(className, whereClause, params)
{
	var query = Wmi.prepare(className, whereClause);
	return Wmi.execQuery(query, params);
};

