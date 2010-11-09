
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
var wmi = new Wmi();
Wmi.extendSubclasses(wmi);

var processes = wmi.Win32_Process();
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.3.2. Select all "svchost.exe" processes. Syntax sugar call. 
var wmi = new Wmi();
Wmi.extendSubclasses(wmi);

var processes = wmi.Win32_Process('Name = "svchost.exe"');
for (var fc = new Enumerator(processes); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name, p.commandLine);
}


// 2.4. Another examples. 


// 2.4.1. Select all services
var wmi = new Wmi();
Wmi.extendSubclasses(wmi);

var services = wmi.Win32_Service();
for (var fc = new Enumerator(services); ! fc.atEnd(); fc.moveNext()) {
    var p = fc.item();
    WScript.Echo(p.Name);
}


// 2.4.2. Select operating system information
var wmi = new Wmi();
Wmi.extendSubclasses(wmi);

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

function Wmi(options)
{
	options = options || {};

	var self = this;

	self.service = null;

	if ( options instanceof ActiveXObject ) {
		self.service = options;
	} else if ( options instanceof Wmi ) {
		self.service = options.service;
	} else if ( typeof options == 'string' || options.moniker ) {
		var moniker = options || options.moniker;
		self.service = GetObject(moniker);
	} else if ( options.user ) {
		self.service = Wmi.connectServer(options);
	} else {
		var moniker = Wmi.getMoniker(options);
		self.service = GetObject(moniker);
	}

	if ( options.extendSubclasses ) {
		Wmi.extendSubclasses(self);
	}
};

Wmi.connectServer = function(options)
{
	options = options || {};

	var swbemLocator = new ActiveXObject('WbemScripting.SWbemLocaltor');
	if ( options.impersonationLevel ) {
		swbemLocator.Security_.ImpersonationLevel = options.impersonationLevel;
	}
	if ( options.authenticationLevel ) {
		swbemLocator.Security_.AuthenticationLevel = options.authenticationLevel;
	}
	if ( options.privileges ) {
		for (var i = 0; i < options.privileges.length; i++) {
			var v = options.privileges[i];
			var p = 'Se' + v.replace(/^\s*!/, '') + 'Privilege';
			var f = ! v.match(/^\s*!/);
			swbemLocator.Security_.Privileges.AddAsString(p, f);
		}
	}
	return swbemLocator.ConnectServer(
		options.computer, 
		options.namespace, 
		options.user, 
		options.password, 
		options.locale, 
		options.authority, 
		options.securityFlag, 
		options.wbemNamedValueSet);
};

Wmi.getMoniker = function(options)
{
	options = options || {};

	var security = [];
	if ( options.impersonationLevel ) {
		security.push('impersonationLevel=' + options.impersonationLevel);
	}
	if ( options.authenticationLevel ) {
		security.push('authenticationLevel=' + options.authenticationLevel);
	}
	if ( options.authority && options.computer ) {
		security.push('authority=' + options.authority);
	}
	if ( options.privileges ) {
		security.push('(' + options.privileges.join(', ') + ')');
	}

	var moniker = ['WinMgmts:'];
	if ( security.length ) {
		moniker.push('{' + security.join(',') + '}');
	}
	if ( options.locale ) {
		moniker.push('[locale=' + options.locale + ']');
	}
	if ( ( security.length || options.locale ) && options.computer ) {
		moniker.push('!');
	}
	if ( options.computer ) {
		moniker.push('\\\\' + options.computer);
	}
	if ( options.namespace ) {
		moniker.push('\\' + options.namespace);
	}
	if ( options.className ) {
		moniker.push(':' + options.className);
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

(function(self)
{

Wmi.createSink = function(callback)
{
	var sinkPrefix = 'SINK' + (new Date()).getTime() + '_';

	if ( typeof callback == 'function' ) {
		self[sinkPrefix + 'OnObjectReady'] = callback;
	} else {
		for (var p in callback) {
			if ( ! callback.hasOwnProperty(p) ) {
				continue;
			}
			self[sinkPrefix + p] = callback[p];
		}
	}

	return WScript.CreateObject('WbemScripting.SWbemSink', sinkPrefix);
};

})(this);

Wmi.prototype.associatorsOf = function(objectPath, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.AssociatorsOf(objectPath, 
			options.assocClass || null, 
			options.resultClass || null, 
			options.resultRole || null, 
			options.role || null, 
			options.classesOnly || false, 
			options.schemaOnly || false, 
			options.requiredAssocQualifier || null, 
			options.requiredQualifier || null, 
			options.flags || 16, 
			options.wbemNamedValueSet || null);
	};

	var sink = Wmi.createSink(callback);
	return this.service.AssociatorsOfAsync(sink, objectPath, 
		options.assocClass || null, 
		options.resultClass || null, 
		options.resultRole || null, 
		options.role || null, 
		options.classesOnly || false, 
		options.schemaOnly || false, 
		options.requiredAssocQualifier || null, 
		options.requiredQualifier || null, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.del = function(objectPath, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.Delete(objectPath, 
			0, 
			options.wbemNamedValueSet || null);
	};

	var sink = Wmi.createSink(callback);
	return this.service.DeleteAsync(sink, objectPath, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.execMethod = function(objectPath, methodName, inParams, callback, async, options)
{
	options = options || {};

	var objClass = this.get(objectPath);
	var objInParams = null;
	if ( inParams ) {
		objInParams = objClass.Methods_(methodName).InParameters.SpawnInstance_();
		for (var p in inParams) {
			if ( ! inParams.hasOwnProperty(p) ) {
				continue;
			}
			objInParams.Properties_.Item(p) = inParams[p];
		}
	}

	if ( ! async ) {
		return this.service.ExecMethod(objectPath, methodName, objInParams, 
			0, 
			options.wbemNamedValueSet || null);
	}

	var sink = Wmi.createSink(callback);
	return this.service.ExecMethodAsync(sink, objectPath, methodName, objInParams, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.execNotificationQuery = function(eventQuery, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		var eventNotifier = this.service.ExecNotificationQuery(eventQuery, 
			options.eventLaguage || 'WQL', 
			options.flags || (16 + 32), 
			options.wbemNamedValueSet || null);
		var eventQuery = eventNotifier.NextEvent();
		return callback(eventQuery);
	}

	var sink = Wmi.createSink(callback);
	return this.service.ExecNotificationQueryAsync(sink, eventQuery, 
		options.eventLaguage || 'WQL', 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.execQuery = function(query, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.ExecQuery(query, 
			options.eventLaguage || 'WQL', 
			options.flags || 16, 
			options.wbemNamedValueSet || null);
	}

	var sink = Wmi.createSink(callback);
	return this.service.ExecQueryAsync(sink, query, 
		options.eventLaguage || 'WQL', 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.exec = function(className, whereClause, callback, async, options)
{
	var query = Wmi.prepare(className, whereClause);
	return this.execQuery(query, callback, async, options);
};

Wmi.prototype.get = function(objectPath, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.Get(objectPath, 
			options.flags || 0, 
			options.wbemNamedValueSet || null);
	}

	var sink = Wmi.createSink(callback);
	return this.service.Get(sink, objectPath, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.instancesOf = function(className, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.InstancesOf(className, 
			options.flags || 16, 
			options.wbemNamedValueSet || null);
	};

	var sink = Wmi.createSink(callback);
	return this.service.InstancesOfAsync(sink, className, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.referencesTo = function(objectPath, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.ReferencesTo(objectPath, 
			options.resultClass || null, 
			options.role || null, 
			options.classesOnly || false, 
			options.schemaOnly || false, 
			options.requiredQualifier || null, 
			options.flags || 16, 
			options.wbemNamedValueSet || null);
	};

	var sink = Wmi.createSink(callback);
	return this.service.ReferencesToAsync(sink, objectPath, 
		options.resultClass || null, 
		options.role || null, 
		options.classesOnly || false, 
		options.schemaOnly || false, 
		options.requiredQualifier || null, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

Wmi.prototype.subclassesOf = function(className, callback, async, options)
{
	options = options || {};

	if ( ! async ) {
		return this.service.SubclassesOf(className, 
			options.flags || 16, 
			options.wbemNamedValueSet || null);
	};

	var sink = Wmi.createSink(callback);
	return this.service.SubclassesOfAsync(sink, className, 
		options.flags || 0, 
		options.wbemNamedValueSet || null, 
		options.wbemAsyncContext || null);
};

(function()
{

var proto = Wmi.prototype;

for (var p in proto) {
	if ( ! proto.hasOwnProperty(p) ) {
		continue;
	}

	(function()
	{
		var matches = proto[p].toString().match(/^function\s*\((.*?)\)/i);
		var n = matches[1].split(/,\s*/).length;
		var m = p;
		Wmi[m] = function()
		{
			var opts = arguments[n - 1];
			var args = Array.prototype.slice.call(arguments, 0, n - 1);

			var wmi = new Wmi(opts);
			return wmi[m].apply(wmi, args);
		};
	})();
}

})();

/*
Wmi.get = function(objectPath, options)
{
	var wmi = new Wmi(options);
	return wmi.get(objectPath);
};

Wmi.execQuery = function(query, options)
{
	var wmi = new Wmi(options);
	return wmi.execQuery(query);
};

Wmi.execMethod = function(objectPath, methodName, inParams, options)
{
	var wmi = new Wmi(options);
	return wmi.execMethod(objectPath, methodName, inParams);
};

Wmi.exec = function(className, whereClause, options)
{
	var wmi = new Wmi(options);
	return wmi.exec(className, whereClause);
};
*/
