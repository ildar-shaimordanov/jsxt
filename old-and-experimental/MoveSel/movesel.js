/**
* void setMovableSelect(selectList [, sortMode [, disabledOptions ]])
* Sets a behavior for the actual SELECT
*
* @param  object  selectList      The reference to the HTMLSelectElement object
* @param  boolean sortMode        Defines the sort mode (true means to sort)
* @param  mixed   disabledOptions The list of non-movable options
*         1. It can be passed as a regexp-like string containing parts or the
*            whole visible texts of the options separated by the | character
*         2. It can be the list of strings of the parts or the whole visible
*            texts as described above
*         3. I can be the mixed case of the first and the second cases
*
* @result void
*/
function setMovableSelect()
{
    var args = setMovableSelect.arguments;
    var sel = args[0];
    if (args[1]) {
        sel.__sort = function()
        {
            var opts = new Array();
            for (var i = 0; i < this.options.length; i++) {
                var opt = this.options[i];
                opts[i] = new Option(opt.text, opt.value);
            }
            opts.sort(
                function(a, b)
                {
                    var x = a.text, y = b.text;
                    return (x > y) ? +1 : (x < y) ? -1 : 0;
                }
            );
            for (var i = 0; i < this.options.length; i++)
                this.options[i] = new Option(opts[i].text, opts[i].value);
        }
    }
    if (args.length > 2) {
        for (var s = args[2], i = 3; i < args.length; i++) s += "|" + args[i];
        sel.__disabledOptions = new RegExp(s);
    }
    if (sel.__sort) sel.__sort();
}

/**
* void moveOption(from, to)
* Moves the selected options from the `from' list to the `to' list
*
* @param  object  from      The reference to the HTMLSelectElement where moving from
* @param  object  to        The reference to the HTMLSelectElement where moving to
*
* @result void
*/
function moveOption(from, to)
{
    if (window.navigator.appVersion.match(/MSIE/)) {
        var before = function() { return to.options.length; }
    } else {
        var before = function() { return null; }
    }
    if (from.__disabledOptions) {
        from.__isDisabledOption = function(opt) { return opt.text.match(from.__disabledOptions); }
    } else {
        from.__isDisabledOption = function(opt) { return false; }
    }
    var i = 0;
    while (i < from.options.length) {
        var opt = from.options[i];
        if (!opt.selected || from.__isDisabledOption(opt)) i++;
        else {
            to.add(new Option(opt.text, opt.value), before());
            from.remove(i);
        }
    }
    if (to.__sort) to.__sort();
}

/**
* void selectList(list)
* Selects all options in the HTMLSelectElement object
*
* @param  object  list      The reference to the HTMLSelectElement to be selected
*
* @result void
*/
function selectList(list)
{
    for (var i = 0; i < list.options.length; i++)
        list.options[i].selected = true;
}

/**
* void selectAllLists(void)
* Selects all options in the all HTMLSelectElement objects
*
* @param  void
*
* @result void
*/
function selectAllLists()
{
    var lists = selectAllLists.arguments;
    for (var i = 0; i < lists.length; i++) selectList(lists[i]);
}

/**
* void moveAllOptions(from, to)
* Selects and moves all options from the `from' list to the `to' list
*
* @param  object  from      The reference to the HTMLSelectElement where moving from
* @param  object  to        The reference to the HTMLSelectElement where moving to
*
* @result void
*/
function moveAllOptions(from, to)
{
    selectList(from);
    moveOption(from, to);
}

