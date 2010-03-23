if ( ! ServiceManager ) {

function ServiceManager()
{

	// {{{ properties

	/**
	 * Reference to the ServiceManager instance.
	 *
	 * @var		ServiceManager
	 * @access	private
	 */
	var self = this;

	/**
	 * List of system components dependencies.
	 *
	 * @var		Array
	 * @access	private
	 */
	var deps;

	// }}}
	// {{{ methods

	/**
	 * The specified service depends on system components returned in the list
	 *
	 * @param	Mixed	service	Name of a service
	 * @param	Boolean	refresh	Refreshes the list of dependent services
	 * @return	Array
	 * @access	public
	 */
	self.antecedent = function(service, refresh)
	{
		return self.associated(service, 'Antecedent');
	};

	/**
	 * The list of system components depend on the specified service
	 *
	 * @param	Mixed	service	Name of a service
	 * @param	Boolean	refresh	Refreshes the list of dependent services
	 * @return	Array
	 * @access	public
	 */
	self.dependent = function(service, refresh)
	{
		return self.associated(service, 'Dependent');
	};

	/**
	 * Recieves the list of services associated with the specified service
	 *
	 * @param	Mixed	service	Name of a service
	 * @param	String	role	Available values are 'Antecedent' or 'Dependent'
	 * @param	Boolean	refresh	Refreshes the list of dependent services
	 * @return	Array
	 * @access	public
	 */
	self.associated = function(service, role, refresh)
	{
		var lookingFor;
		switch ( role ) {
		case 'Antecedent':
			lookingFor = 'Dependent';
			break;
		case 'Dependent':
			lookingFor = 'Antecedent';
			break;
		default:
			throw new TypeError();
		}

		if ( refresh || ! deps ) {
			self.updateDependentService();
		}

		function lookingForNext(name)
		{
			var result = [];
			for (var i = 0; i < deps.length; i++) {
				var matches = deps[i][lookingFor].match(/.+?"([^"]+)"$/);
				if ( ! matches || matches[1] != name ) {
					continue;
				}
				var next = deps[i][role].replace(/.+?"([^"]+)"$/, '$1');
				var list = lookingForNext(next);
				result = result.union(list);
				result.push(next);
			}
			return result;
		}

		var nameList = lookingForNext(service.Name);
		var names = nameList
			.map(function(name)
			{
				return 'Name="' + name + '"';
			})
			.join(' OR ');

		var sql = 'SELECT * FROM Win32_Service WHERE ( ' + names + ' )';
		return self.query(sql);
	};

	/**
	 * Execute specified query to the WMI and 
	 * returns array as result
	 *
	 * @param	String	sql
	 * @return	Array
	 * @access	public
	 */
	self.query = function(sql)
	{
		return Array.enumerate(WMI.ExecQuery(sql));
	};

	/**
	 * Searches services specified by names
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	Array
	 * @access	public
	 */
	self.search = function(service)
	{
		var sql = 'SELECT * FROM Win32_Service';

		var name = service.Name
			.replace(/^\s+/, '')
			.replace(/\s+$/, '')
			.replace(/"/g, '');

		if ( name ) {
			sql += ' WHERE ' + name
				.split(/\s+/)
				.map(function(value)
				{
					return 'Name LIKE "' + value + '"';
				})
				.join(' OR ');
		}

		return self.query(sql);
	};

	self.updateDependentService = function()
	{
		deps = self.query('SELECT * FROM Win32_DependentService');
	};

	/**
	 * Returns a message describing an exit code
	 *
	 * @param	Integer	code
	 * @return	String
	 * @access
	 */
	self.exitMessage = function(code)
	{
		var messages = [
			'The request was accepted.',
			'The request is not supported.',
			'The user did not have the necessary access.',
			'The service cannot be stopped because other services that are running are dependent on it.',
			'The requested control code is not valid, or it is unacceptable to the service.',
			'The requested control code cannot be sent to the service because the state of the service (Win32_BaseService:State) is equal to 0, 1, or 2.',
			'The service has not been started.',
			'The service did not respond to the start request in a timely fashion.',
			'Unknown failure when starting the service.',
			'The directory path to the service executable was not found.',
			'The service is already running.',
			'The database to add a new service is locked.',
			'A dependency for which this service relies on has been removed from the system.',
			'The service failed to find the service needed from a dependent service.',
			'The service has been disabled from the system.',
			'The service does not have the correct authentication to run on the system.',
			'This service is being removed from the system.',
			'There is no execution thread for the service.',
			'There are circular dependencies when starting the service.',
			'There is a service running under the same name.',
			'There are invalid characters in the name of the service.',
			'Invalid parameters have been passed to the service.',
			'The account, which this service is to run under is either invalid or lacks the permissions to run the service.',
			'The service exists in the database of services available from the system.',
			'The service is currently paused in the system.'];

		if ( 'number' != typeof code ) {
			return 'Unknown exit code';
		}

		if ( code < 0 || code >= messages.length ) {
			return 'Win32 error code: ' + code;
		}

		return messages[code];
	};

	/**
	 * Applies the specific method for the Win32_Service class
	 * If the method requires parameters they should be passed
	 * as object like {'name1': value1, 'name2': value2, ...}
	 *
	 * @param	Mixed	service	Name of a service
	 * @param	String	cmd
	 * @param	Object	params
	 * @return	Integer
	 * @access	public
	 */
	self.exec = function(service, cmd, params)
	{
		var name = service.Name;

		// Obtain an instance of the the class using a key property value.
		var objShare = WMI.Get('Win32_Service.Name="' + name + '"');
		var objOutParam;

		if ( ! params ) {
			// no InParameters to define

			// Execute the method and obtain the return status.
			// The OutParameters object in objOutParams is created by the provider.
			objOutParam = WMI.ExecMethod('Win32_Service.Name="' + name + '"', cmd);
		} else {
			// Obtain an InParameters object specific to the method.
			var objInParam = objShare.Methods_(cmd).inParameters.SpawnInstance_();

			// Add the input parameters.
			for (var p in params) {
				objInParam.Properties_.Item(p) = params[p];
			}

			// Execute the method and obtain the return status.
			// The OutParameters object in objOutParams is created by the provider.
			objOutParam = WMI.ExecMethod('Win32_Service.Name="' + name + '"', cmd, objInParam);
		}

		return objOutParam.ReturnValue;
	};

	/**
	 * Changes startup mode of the selected service
	 *
	 * @param	Mixed	service	Name of a service
	 * @param	String	mode
	 * @return	void
	 * @access	public
	 */
	self.serviceStartMode = function(service, mode)
	{
		var list = ['Automatic', 'Manual', 'Disabled'];
		if ( list.indexOf(mode) < 0 ) {
			throw new TypeError();
		}

		return self.exec(service, 'ChangeStartMode', {StartMode: mode});
	};

	/**
	 * Pauses the selected service that is running
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.servicePause = function(service)
	{
		return self.exec(service, 'PauseService');
	};

	/**
	 * Restarts the selected service that is paused
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceResume = function(service)
	{
		return self.exec(service, 'ResumeService');
	};

	/**
	 * Starts the selected service that is stopped
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceStart = function(service)
	{
		return self.exec(service, 'StartService');
	};

	/**
	 * Stops the selected service that is running
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceStop = function(service)
	{
		return self.exec(service, 'StopService');
	};

	/**
	 * Pauses/resumes the selected service
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceToggle = function(service)
	{
		return service.State == 'Running' 
			? self.servicePause(service) 
			: self.serviceResume(service);
	};

};

}

if ( ! ServiceView ) {

function ServiceView()
{

	/**
	 * Draws a list of services
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.contentDraw = function()
	{
		var result = '';
		for (var i = 0; i < services.length; i++) {
			var trClass = services[i].ProcessId 
//				? 'running' 
				? ( services[i].StartMode == 'Disabled' ? 'running disabled' : 'running' ) 
				: ( services[i].StartMode == 'Disabled' ? 'disabled' : 'stopped' );
			services[i].State.match(/pending/i) && ( trClass += ' pending' );
			services[i].State.match(/pause/i)   && ( trClass += ' paused' );
			result += '<tr class="' + trClass + '" title="' + services[i].PathName.htmlize() + '">' 
				+ '<td>' + services[i].DisplayName.htmlize().hyphenize() + '</td>' 
				+ '<td>' + services[i].StartMode + '</td>' 
				+ '<td>' + services[i].State + '</td>' 
				+ '<td>' + ( services[i].ProcessID ? services[i].ProcessID : '&nbsp;' ) + '</td>' 
				+ '</tr>';
		}
		document.getElementById('content').innerHTML = '<table>' 
			+ '<tr id="header">' 
			+ '<th class="string">Name</th>' 
			+ '<th class="stringShort">Startup&nbsp;Type</th>' 
			+ '<th class="stringShort">Status</th>' 
			+ '<th class="stringShort">Process&nbsp;ID</th>' 
			+ '</tr>' 
			+ result 
			+ '</table>';

	};

	/**
	 * Displays a list of services
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.contentDisplay = function()
	{
		self.contentDraw();
		self.contentFocus();
	};

	/**
	 * Puts focus to the content
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.contentFocus = function()
	{
		document.getElementById('content').focus();
	};

	/**
	 * Hides the search form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formSearchHide = function()
	{
		document.getElementById('searchForm').style.display = 'none';
		self.contentFocus();
	};

	/**
	 * Shows the search form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formSearchShow = function()
	{
		document.getElementById('searchForm').style.display = '';
		document.getElementById('searchName').select();
	};

	/**
	 * Submits a value from the search form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formSearchSubmit = function()
	{
		self.formSearchHide();
		self.search();
	};

	/**
	 * Shows/hides the search form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formSearchToggle = function()
	{
		var form = document.getElementById('searchForm');
		if ( form.style.display ) {
			self.formSearchShow();
		} else {
			self.formSearchHide();
		}
	};

	/**
	 * Hides the startup mode form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formStartupHide = function()
	{
		document.getElementById('startupForm').style.display = 'none';
		self.contentFocus();
	};

	/**
	 * Shows the startup mode form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formStartupShow = function()
	{
		document.getElementById('startupForm').style.display = '';

		var service = services[selectedRowIndex - 1];

		var startupType = document.getElementById('startupType');
		for (var i = 0; i < startupType.options.length; i++) {
			startupType.options[i].selected = startupType.options[i].text == service.StartMode;
		}
	};

	/**
	 * Submits a value from the startup mode form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formStartupSubmit = function()
	{
		self.formStartupHide();
		self.serviceConfigure();
		self.search();
	};

	/**
	 * Shows/hides the startup mode form
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.formStartupToggle = function()
	{
		var form = document.getElementById('startupForm');
		if ( form.style.display ) {
			self.formStartupShow();
		} else {
			self.formStartupHide();
		}
	};

	/**
	 * Validates the row index
	 *
	 * @param	Integer	rowIndex
	 * @return	Boolean
	 * @access	public
	 */
	self.isValidRowIndex = function(rowIndex)
	{
		var list = document.getElementById('content').firstChild;
		if ( ! list ) {
			return false;
		}

		var rows = list.rows;
		if ( rowIndex < 1 || rowIndex >= rows.length ) {
			return false;
		}

		return true;
	};

	/**
	 * Selects/unselects a row and service matching this row.
	 *
	 * @param	Object	row	The HTMLTableRowElement or HTMLTableCellElement
	 * @return	void
	 * @access	public
	 */
	self.rowSelect = function(row)
	{
		if ( ! row || ! row.tagName ) {
			return;
		}

		if ( row.tagName.toUpperCase() == 'TD' ) {
			row = row.parentNode;
		}

		if ( row.tagName.toUpperCase() != 'TR' ) {
			return;
		}

		var rowIndex = row.rowIndex;
		if ( selectedRowIndex == rowIndex ) {
			self.serviceSelect(selectedRowIndex, false);
			selectedRowIndex = 0;
		} else {
			self.serviceSelect(selectedRowIndex, false);
			self.serviceSelect(rowIndex, true);
			selectedRowIndex = rowIndex;
		}
	};

	/**
	 * Recieves the list of services associated with the specified service
	 * This method is very slow than the ServiceManager.serviceAssociate()
	 *
	 * @param	Win32_Service	service
	 * @param	String		role		Available values are 'Antecedent' or 'Dependent'
	 * @param	Boolean		all		If it is TRUE list all services (active and inactive)
	 * @return	Array
	 * @access	public
	 * @see	ServiceManager.serviceAssociate()
	 */
	self.serviceAssoc = function(service, role, all)
	{
		var sql = 'Associators of {Win32_Service.Name="' + service.Name + '"} WHERE AssocClass=Win32_DependentService Role=' + role;
		var query = WMI.ExecQuery(sql);

		function cmpServiceNameUnique(x, y)
		{
			return x.Name != y.Name;
		}

		var result = [];

		var enumer = new Enumerator(WMI.ExecQuery(sql));
		while ( ! enumer.atEnd() ) {
			var service = enumer.item();
			enumer.moveNext();

			if ( ! all && service.State != 'Running' ) {
				continue;
			}

			var list = self.serviceAssoc(service, role, all);
			//result = result.concat(list);
			result = result.union(list, cmpServiceNameUnique);
			result[result.length] = service;
		}

		return result;
	};

	/**
	 * Configure startup mode of the selected service
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceConfigure = function()
	{
		var list = ['Automatic', 'Manual', 'Disabled'];
		var type = document.getElementById('startupType').options.selectedIndex;

		var service = services[selectedRowIndex - 1];
		self.serviceCmd(service, 'ChangeStartMode', {'StartMode': list[type]});
	};

	/**
	 * Pauses the selected service that is running
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.servicePause = function()
	{
		var service = services[selectedRowIndex - 1];
		self.serviceCmd(service, 'PauseService');
	};

	/**
	 * Restarts the selected service that is running
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceRestart = function()
	{
		self.serviceStopStart(true);
	};

	/**
	 * Restarts the selected service that is paused
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceResume = function()
	{
		var service = services[selectedRowIndex - 1];
		self.serviceCmd(service, 'ResumeService');
	};

	/**
	 * Selects/unselects a service specified by the row index.
	 * The selection state affects on the controls state.
	 *
	 * @param	Integer	rowIndex	The number of a row to be selected
	 * @param	Boolean	state		Select a row if it is TRUE
	 * @return	void
	 * @access	public
	 */
	self.serviceSelect = function(rowIndex, state)
	{
		self.toolbarModify(rowIndex, state);

		document.getElementById('serviceName').innerHTML = '';
		document.getElementById('serviceDesc').innerHTML = '';
		document.getElementById('servicePath').innerHTML = '';

		if ( ! self.isValidRowIndex(rowIndex) ) {
			return;
		}

		var service = services[rowIndex - 1];
		var row = document.getElementById('content').firstChild.rows[rowIndex];

		if ( ! state ) {
			row.className = row.className.replace(/\s*\bselected\b\s*/, '');
		} else {
			row.className += ' selected';
			document.getElementById('serviceName').innerHTML = service.DisplayName.htmlize();
			document.getElementById('serviceDesc').innerHTML = (service.Description || '').htmlize();
			document.getElementById('servicePath').innerHTML = service.PathName.htmlize();
		}
	};

	/**
	 * Starts the selected service that is stopped
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceStart = function()
	{
		var service = services[selectedRowIndex - 1];
		self.serviceCmd(service, 'StartService');
	};

	/**
	 * Stops the selected service that is running
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceStop = function()
	{
		self.serviceStopStart(false);
	};

	/**
	 * Stops and restarts the selected service that is running
	 *
	 * @param	Boolean	restart
	 * @return	void
	 * @access	public
	 */
	self.serviceStopStart = function(restart)
	{
		// Recieve a list of all dependent dervices
		var service = services[selectedRowIndex - 1];
		//var srv = self.serviceAssoc(service, 'Antecedent');
		var srv = self.serviceAssociate(service, 'Antecedent');

		if ( srv.length ) {
			var names = srv.foreach(function(obj)
			{
				return obj.DisplayName;
			});

			var action = restart ? 'restart' : 'stop';
			var btn = confirm('When ' + service.DisplayName + ' ' + action + 's, these other services will also ' + action + '.\n\n' 
				+ names.join('\n') 
				+ '\n\nDo you want ' + action + ' these services?');
			if ( ! btn ) {
				return;
			}
		}

		// Stopping
		srv[srv.length] = service;
		var result = srv.filter(function(service)
		{
			var exitCode = self.serviceCmd(service, 'StopService');
			if ( exitCode ) {
				alert(self.serviceExitMessage(exitCode));
				return false;
			}
			while ( 'Stopped' != self.serviceQuery('SELECT State FROM Win32_Service WHERE Name="' + service.Name + '"')[0].State ) {
			}
			return true;
		});

		if ( ! restart ) {
			return;
		}

		if ( result.length != srv.length ) {
			alert('One of the services has been stopped with fail. Restart is not able');
		}

		// Starting
		srv.reverse();
		var result = srv.filter(function(service)
		{
			var exitCode = self.serviceCmd(service, 'StartService');
			if ( exitCode ) {
				alert(self.serviceExitMessage(exitCode));
				return false;
			}
			return true;
		});
	};

	/**
	 * Pauses/resumes the selected service
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.serviceToggle = function()
	{
		var service = services[selectedRowIndex - 1];
		if ( service.State == 'Running' ) {
			self.servicePause();
		} else {
			self.serviceResume();
		}
	};

	/**
	 * Adds a  customized button on the toolbar
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.toolbarAddCustom = function()
	{
		var param = CustomControlServiceManager.newControl();
		if ( ! param ) {
			return;
		}

		var result = '<input class="button" type="button" id="custom" disabled="disabled"';
		if ( param.value ) {
			result += ' value="' + param.value + '"';
		} else {
			result += ' value="~"';
		}
		if ( param.title ) {
			result += ' title="' + param.title + '"';
		} else {
			result += ' title="Customized Button"';
		}
		if ( param.style ) {
			result += ' style="' + param.style + '"';
		}
		result += ' />';

		document.getElementById('customContainer').innerHTML = result;
	};

	/**
	 * Handles a click event on the customized button
	 *
	 * @param	void
	 * @return	void
	 * @access	public
	 */
	self.toolbarClickCustom = function()
	{
		if ( ! self.isValidRowIndex(selectedRowIndex) ) {
			return;
		}

		var service = services[selectedRowIndex - 1];
		CustomControlServiceManager.click(service, shell);
		self.contentFocus();
	};

	/**
	 * Modifies a state of controls on the toolbar
	 *
	 * @param	Integer	rowIndex	The number of a row to be selected
	 * @param	Boolean	state		Select a row if it TRUE
	 * @return	void
	 * @access	public
	 */
	self.toolbarModify = function(rowIndex, state)
	{
		var startup = document.getElementById('startup');
		var start   = document.getElementById('start');
		var pause   = document.getElementById('pause');
		var stop    = document.getElementById('stop');
		var restart = document.getElementById('restart');
		var custom  = document.getElementById('custom');

		// Turn off all controls
		startup.disabled = 
		start.disabled   =
		pause.disabled   = 
		stop.disabled    = 
		restart.disabled = true;
		if ( custom ) {
			custom.disabled  = true;
		}

		// Disable all controls
		if ( ! state ) {
			return;
		}

		if ( ! self.isValidRowIndex(rowIndex) ) {
			return;
		}

		// Set controls corresponding of a service state
		var service = services[rowIndex - 1];

		startup.disabled = false;
		start.disabled   = service.StartMode == 'Disabled' || service.State == 'Running' || service.State != 'Stopped';
		pause.disabled   = ! service.AcceptPause;
		stop.disabled    = 
		restart.disabled = ! service.AcceptStop || service.State != 'Running';
		if ( custom ) {
			custom.disabled = ! CustomControlServiceManager.state(service);
		}
	};

	// }}}
	// {{{ contructor

	;

	// }}}

};

}

