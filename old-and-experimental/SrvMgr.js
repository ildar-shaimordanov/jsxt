//
// JScript add-on
//
// @copyright	Copyright (c) 2009 by Ildar Shaimordanov
//


function ServiceManager(WMI)
{

	var self = this;

	if ( ! WMI ) {
		WMI = GetObject('WinMgmts:');
	}

	/**
	 * Execute specified query to the WMI and returns an array as result
	 *
	 * @param	String	sql
	 * @return	Array
	 * @access	public
	 */
	self.query = function(sql)
	{
sql.print();
		return Array.enumerate(WMI.ExecQuery(sql), function(v)
		{
v.Name.print();
			return v;
		});
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
	self.serviceExec = function(service, cmd, params)
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
	 * Checks that the service start mode is automatical
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsAuto = function(service)
	{
		return service.StartMode == 'Auto';
	};

	/**
	 * Checks that the service start mode is disabled
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsDisabled = function(service)
	{
		return service.StartMode == 'Disabled';
	};

	/**
	 * Checks that the service start mode is manual
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsManual = function(service)
	{
		return service.StartMode == 'Manual';
	};

	/**
	 * Checks that the service is running now
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsRunning = function(service)
	{
		return srv.State == 'Running';
	};

	/**
	 * Checks that the service is in starting state
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsStartPending = function(service)
	{
		return service.State == 'Start Pending';
	};

	/**
	 * Checks that the service is in stopping state
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsStopPending = function(service)
	{
		return service.State == 'Stop Pending';
	};

	/**
	 * Checks that the service has been stopped now
	 *
	 * @param	Mixed	service
	 * @return	Boolean
	 * @access	public
	 */
	self.serviceIsStopped = function(service)
	{
		return service.State == 'Stopped';
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
		return self.serviceExec(service, 'PauseService');
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
		return self.serviceExec(service, 'ResumeService');
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
		return self.serviceExec(service, 'StartService');
	};

	/**
	 * Changes startup mode of the selected service to 'Automatic'
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceStartupAuto = function(service)
	{
		return self.serviceExec(service, 'ChangeStartMode', {StartMode: 'Automatic'});
	};

	/**
	 * Changes startup mode of the selected service to 'Disabled'
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceStartupDisabled = function(service)
	{
		return self.serviceExec(service, 'ChangeStartMode', {StartMode: 'Disabled'});
	};

	/**
	 * Changes startup mode of the selected service to 'Manual'
	 *
	 * @param	Mixed	service	Name of a service
	 * @return	void
	 * @access	public
	 */
	self.serviceStartupManual = function(service)
	{
		return self.serviceExec(service, 'ChangeStartMode', {StartMode: 'Manual'});
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
		return self.serviceExec(service, 'StopService');
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



var frmt = '%6s: %s';

'1 ----------'.print();
var srvmgr = new ServiceManager();

'2 ----------'.print();
var x = srvmgr.search({Name: 'SIU%'});

'3 ----------'.print();
var siu45 = x.filter(function(v)
{
	return v.Name == 'SIU_45FP06_SOLID';
})[0];

'4 ----------'.print();
srvmgr.serviceStop(siu45);

'5 ----------'.print();
var s = srvmgr.query('SELECT Name FROM Win32_Service WHERE Name = "SIU_45FP06_SOLID" AND State = "Stopped"');
('[' + s[0] + ']').print();

'6 ----------'.print();
x.forEach(function(v)
{
	'===='.print();
	frmt.sprintf('name', v.Name).print();
	frmt.sprintf('desc', v.Description).print();
	frmt.sprintf('mode', v.StartMode).print();
	frmt.sprintf('state', v.State).print();
});

