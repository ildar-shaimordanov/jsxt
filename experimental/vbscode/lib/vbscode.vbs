' VBScript code minifier
'
' USAGE
'
' Dim text
' text = "x = 1" & vbCrLF & "y = 2"
' text = New VBSCode.minify(text)
' ' Results to: "x=1:y=2"
'
' DESCRIPTION
'
' This class implements the minification feature of VBScript codes
' written in VBScript.
'
' I found the only two implementations: one is written on Python and
' has partial support of minification, second is Ruby-based library
' having wide support. In my opinion, the better way is to implement
' this feature on VBScript itself.
'
' This class does all the best to minify the code. It uses RegExp actively
' and produces a bit shorter output than the Ruby library.
'
' LIMITATIONS
'
' However, both VBScript and Ruby implementations don't manage with
' the single-line version of "If ... Then ... Else ..." and generate
' non-working code. The minified code doesn't start and throws the
' compilation error "Microsoft VBScript compilation error: Expected
' 'If'".
'
' There is short example demonstrating a failure:
'
' Function max(a, b)
' 	If a > b Then max = a Else max = b
' End Function
'
' The minified version doesn't work:
'
' Function max(a,b):If a>b Then max=a Else max=b:End Function
'
' To resolve this issue a deeper analysis is needed to distinguish
' the single-line syntax and put the line break immediately after this
' construction.
'
' SEE ALSO
'
' https://github.com/freginold/thinIt
' https://github.com/noraj/vbsmin
' https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/if-then-else-statement
'
' AUTHORS
'
' Copyright 2021, Ildar Shaimordanov
'
' MIT

Option Explicit

Class VBSCode

	Private re_comment_or_continue

	Private re_outer_spaces
	Private re_space_punct
	Private re_punct_space
	Private re_inner_colons
	Private re_word_space_word

	Private re_outer_colons

	Private Sub Class_Initialize
		' This regex recognizes the comment and line continuation
		' and removes them safely.
		'
		' The comment is the part of the line beginning with
		' the apostrophe "'" or word "rem" (case-insensitive)
		' and spread until the end of the line. Also any number
		' of white spaces and colons ":" preceding directly the
		' comment are removed.
		'
		' The line continuation is the standalone underscore "_"
		' at the end of the line. Also any number of white spaces
		' and colons preceding directly the line continuation
		' are removed.
		'
		' Below is the extended or unfolded version of the regex:
		'
		' " [^"]* "
		' |
		' [\s:]*
		' ( ' | \b rem \b )	# captured in match.submatches(0)
		' .*
		' |
		' ( \w\s | \W )		# captured in match.submatches(1)
		' \s* _ $
		Set re_comment_or_continue = New RegExp
		re_comment_or_continue.Global = True
		re_comment_or_continue.IgnoreCase = True
		re_comment_or_continue.Pattern = """[^""]*""" _
			& "|[\s:]*('|\brem\b).*" _
			& "|(\w\s|\W)\s*_$"

		' This regex is used to remove all leading and trailing
		' white spaces. Applied for the text chunk (a part of
		' the entire text after splitting by the double quotes)
		' it quarantees that the chunk will not have any white
		' spaces at the beginning and end. So after concatenating
		' (joining with the double quotes) the chunks the entire
		' text white spaces around double quotes will be removed.
		Set re_outer_spaces = New RegExp
		re_outer_spaces.Global = True
		re_outer_spaces.Pattern = "^\s+|\s+$"

		' This regex is used to remove white spaces before
		' punctuation characters only: "[", "]", "(", ")", "<",
		' ">", "&", ".", ",", ":", "=", "*", "/", "%", "+", "-".
		Set re_space_punct = New RegExp
		re_space_punct.Global = True
		re_space_punct.Pattern = "\s+([\[\]()<>&.,:=*/%+-])"

		' This regex is used to remove white spaces after
		' punctuation characters only: "[", "]", "(", ")", "<",
		' ">", "&", ".", ",", ":", "=", "*", "/", "%", "+", "-".
		Set re_punct_space = New RegExp
		re_punct_space.Global = True
		re_punct_space.Pattern = "([\[\]()<>&.,:=*/%+-])\s+"

		' This regex is used to reduce multiple sequential colons
		' ":" into single one.
		Set re_inner_colons = New RegExp
		re_inner_colons.Global = True
		re_inner_colons.Pattern = ":+"

		' This regex is used to squeeze white spcaes between
		' words into the single one.
		Set re_word_space_word = New RegExp
		re_word_space_word.Global = True
		re_word_space_word.Pattern = "(\w)\s+(\w)"

		' This regex is used to remove all leading and trailing
		' colons ":" in the entire text.
		Set re_outer_colons = New RegExp
		re_outer_colons.Global = True
		re_outer_colons.Pattern = "^:+|:+$"
	End Sub

	Public Function minify(text)
		Dim lines, i, line

		' For sure that splitting on CRLF or LF
		text = Replace(text, Chr(13), Chr(10))

		lines = Split(text, Chr(10))
		For i = 0 To UBound(lines)
			line = lines(i)
			line = remove_comment_and_continuation(line)
			lines(i) = line
		Next

		text = Join(lines, "")

		text = reduce_space_and_punct(text)
		text = remove_outer_colons(text)

		minify = text
	End Function

	' Remove comments or line continuation. The removed line
	' continuation is replaced with the single white space. In other
	' cases the line is ended with the colon ":".
	Private Function remove_comment_and_continuation(text)
		Dim eol, matches, match

		eol = ":"

		Set matches = re_comment_or_continue.Execute(text)
		For Each match in matches
			' Non-empty submatches(0) refers to the comment
			If match.SubMatches(0) <> "" Then
				text = Left(text, match.FirstIndex)
				Exit For
			End If
			' Non-empty submatches(1) refers to the line continuation
			If match.SubMatches(1) <> "" Then
				eol = " "
				text = Left(text, match.FirstIndex) _
					& match.SubMatches(1)
				Exit For
			End If
		Next

		If text <> "" Then
			text = text & eol
		End If

		remove_comment_and_continuation = text
	End Function

	' Remove white spaces around punctuation characters, squeeze
	' multiple colons ":" into a single one, squeeze all white spaces
	' between words into a single white space.
	Private Function reduce_space_and_punct(text)
		Dim chunks, i, chunk

		chunks = Split(text, """")
		For i = 0 To UBound(chunks) Step 2
			chunk = chunks(i)
			chunk = re_outer_spaces.Replace(chunk, "")
			chunk = re_space_punct.Replace(chunk, "$1")
			chunk = re_punct_space.Replace(chunk, "$1")
			chunk = re_inner_colons.Replace(chunk, ":")
			chunk = re_word_space_word.Replace(chunk, "$1 $2")
			chunks(i) = chunk
		Next

		reduce_space_and_punct = Join(chunks, """")
	End Function

	' Remove leading and trailing colons ":".
	Private Function remove_outer_colons(text)
		remove_outer_colons = re_outer_colons.Replace(text, "")
	End Function

End Class
