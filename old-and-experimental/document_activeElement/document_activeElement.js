
/**
 * @description
 * Enables the document.activeElement property. 
 *
 * @limitation
 * A compatibility with the MSIE is not complete because of 
 * - this script does not make difference between BODY and HTML tags; 
 * - different mechanisms of event capturing/bubbling for MSIE and Gecko
 */
(function()
{

	if ( ! window.addEventListener ) {
		return;
	}

	/**
	 * This flag is used in order to prevent blur event for html elements
	 * when the document blurs.
	 *
	 * @var		Boolean
	 * @access	private
	 */
	var bodyBlured = false;

	/**
	 * Blurs the html body
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function blurBody(e)
	{
		e.stopPropagation();
	}

	/**
	 * Blurs the document
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function blurDocument()
	{
		bodyBlured = true;
	}

	/**
	 * Blurs the specific html element
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function blurElement()
	{
		if ( bodyBlured ) {
			return;
		}
		focusBody();
	}

	/**
	 * Focuses the html body
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function focusBody()
	{
		document.activeElement = document.body;
	}

	/**
	 * Focuses the document
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function focusDocument()
	{
		bodyBlured = false;
		focusBody();
	}

	/**
	 * Focuses the specific html element
	 *
	 * @param	void
	 * @return	void
	 * access	private
	 */
	function focusElement()
	{
		document.activeElement = this;
	}

	window.addEventListener('load', function()
	{
		document.addEventListener('focus', focusDocument, true);
		document.addEventListener('blur',  blurDocument,  true);

		var f = document.forms;
		for (var i = 0; i < f.length; i++) {
			var e = f[i].elements;
			for (var j = 0; j < e.length; j++) {
				e[j].addEventListener('focus', focusElement, true);
				e[j].addEventListener('blur',  blurElement,  true);
			}
		}
	}, true);
	
})();

