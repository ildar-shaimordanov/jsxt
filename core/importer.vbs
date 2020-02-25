'
' importer.js
' Import modules by name or filename similar to the NodeJS "require"
'
' Copyright (c) 2019, 2020 by Ildar Shaimordanov
'
' @see
' https://blog.ctglobalservices.com/scripting-development/jgs/include-other-files-in-vbscript/
' https://helloacm.com/include-external-files-in-vbscriptjscript-wsh/
' https://www.planetcobalt.net/sdb/importvbs.shtml
' https://stackoverflow.com/a/316169/3627676
' https://stackoverflow.com/a/43957897/3627676
' https://riptutorial.com/vbscript/topic/8345/include-files


' Create and return an instance of the Importer class
' Can be useful to import VBScript modules from JScript
'
' @return	<Importer>
Function CreateImporter
	Set CreateImporter = New Importer
End Function


Class Importer
	' For caching already loaded modules
	Private cache

	' File system object, used internally
	Private fso

	' The list of of paths used to resolve the module location
	Public paths

	' format of the opened file
	' (-2 - system default, -1 - Unicode file, 0 - ASCII file)
	Public format

	' Initialize importer
	Private Sub Class_Initialize
		Set cache = CreateObject("Scripting.Dictionary")
		Set fso = CreateObject("Scripting.FileSystemObject")

		Dim re
		Set re = New RegExp
		re.Pattern = "(\.[^.]+\?)?\.[^.]+$"

		Dim mydir, myself

		mydir = fso.GetParentFolderName(WScript.ScriptFullName)
		myself = re.Replace(WScript.ScriptName, "")

		Dim shell, cwd

		Set shell = WScript.CreateObject("WScript.Shell")
		cwd = shell.CurrentDirectory

		paths = Array( _
			  mydir & "\vbs" _
			, mydir & "\" & myself _
			, mydir & "\" & myself & "\vbs" _
			, mydir & "\lib" _
			, cwd _
		)
		If fso.GetBaseName(mydir) = "bin" Then
			ReDim Preserve paths(UBound(paths) + 1)
			paths(UBound(paths)) = mydir & "\..\lib"
		End If
	End Sub

	' Destroy importer
	Private Sub Class_Terminate
		Set paths = Nothing
		Set fso = Nothing
		Set cache = Nothing
	End Sub

	Private Sub PathIncrement(insert, apath)
		Dim gain
		If IsArray(apath) Then
			gain = UBound(apath) + 1
		Else
			gain = 1
		End If

		Dim count
		count = UBound(paths)

		Redim Preserve paths(count + gain)

		Dim i

		If insert = 1 Then
			For i = count To 0 Step -1
				paths(i + gain) = paths(i)
			Next
			count = 0
		End If

		If IsArray(apath) Then
			For i = 0 To gain - 1
				paths(count + i) = apath(i)
			Next
		Else
			paths(count) = apath
		End If
	End Sub

	' Add a path or array of paths to the begin of the list of paths
	'
	' @param	<String|Array>	Path or array of paths
	Public Sub PathInsert(apath)
		PathIncrement 1, apath
	End Sub

	' Add a path or array of paths to the end of the list of paths
	'
	' @param	<String|Array>	Path or array of paths
	Public Sub PathAppend(apath)
		PathIncrement 0, apath
	End Sub

	' Load a text
	'
	' @param	<String>	a text to be executed
	Public Sub Execute(text)
		On Error GoTo 0
		ExecuteGlobal text
		On Error Resume Next
	End Sub

	' Load a module by name of filename
	'
	' @param	<String>	module name or path
	Public Sub Import(id)
		On Error GoTo 0

		Dim Name

		Dim ErrStr

		Select Case VarType(id)
		Case vbString
			Name = id
		Case vbEmpty
			ErrStr = "Missing path (Empty)"
		Case vbNull
			ErrStr = "Missing path (Null)"
		Case Else
			ErrStr = "Path must be a string"
		End Select

		If ErrStr <> "" Then
			Err.Description = ErrStr
			Err.Raise vbObjectError
		End If

		Dim file
		file = Resolve(id)

		If Not cache.Exists(file) Then
			Dim text
			text = ReadFile(file)
			ExecuteGlobal text

			cache.Add file, 1
		End If

		On Error Resume Next
	End Sub

	' Read a file
	Private Function ReadFile(file)
		Dim stream
		Set stream = fso.OpenTextFile(file, 1, False, format)
		ReadFile = stream.ReadAll
		stream.Close
		Set stream = Nothing
	End Function

	' Resolve a location of the module
	'
	' @param	<String>	module name or path
	' @return	<String>	resolved location of the module
	Public Function Resolve(id)
		Dim file

		Dim re
		Set re = New RegExp

		re.Pattern = "[\\\/]|\.vbs$"
		re.IgnoreCase = True
		If re.Test(id) Then
			' module looks like a path
			re.Pattern = "\.[^.\\\/]+$"
			If re.Test(id) Then
				file = id
			Else
				file = id & ".vbs"
			End If
			Resolve = AbsolutePath(file)
		Else
			' attempt to load a librarian module
			Dim path
			For Each path In paths
				file = path & "\" & id & ".vbs"
				Resolve = AbsolutePath(file)
				If Resolve <> "" Then
					Exit For
				End If
			Next
		End If

		If Resolve = "" Then
			Err.Description = "Cannot find module '" & id & "'"
			Err.Raise vbObjectError
		End If
	End Function

	' Return the absolute path if file exists, otherwise - empty string
	Private Function AbsolutePath(file)
		AbsolutePath = ""
		If fso.FileExists(file) Then
			AbsolutePath = fso.GetAbsolutePathName(file)
		End If
	End Function

End Class
