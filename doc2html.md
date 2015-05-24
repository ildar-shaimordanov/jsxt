_This page is the help from the latest version of the script allowing to convert WinWord document to the most popular formats._



```
doc2html and more
Copyright (C) 2004, 2009, 2010, 2012 Ildar Shaimordanov

This tool allows to convert any DOC or DOCX file to several different
formats such as plain text TXT (both DOS, Win, etc), or reach text RTF, or
hyper-text HTML (default), MHT (web archive), XML, or PDF, or XPS.

Using doc2fb.xsl file it is possible to convert to FictionBook format (FB2).

There are options:

/H
    Outputs this help page.

/F:format
    Specifies output format as TXT, RTF, HTML, MHT, XML, PDF or XPS.
    Additionally FB2 stands for transformations to FictionBook format.

/E:encoding
    A numeric value of the encoding to be used when saving as a plain text
    file. This option is significant with /F:TXT only. Refer to your
    system locales to learn which encodings ar available there.

    The Russian or Ukrainian users can refer to the list below:
    866   - DOS
    28595 - ISO
    20866 - KOI8-R
    21866 - KOI8-U
    10007 - Mac
    1251  - Win

/L:lineending
    The option specifies characters to be used as line ending. There are
    four available values - CRLF, CR, LF, or LFCR. The default value is
    CRLF. This option is significant with /F:TXT only.

/XSL:filename
    The option specifies a name of a XSLT file for transformations to FictionBook format.

/V
    Turn on verbosity.

/FG
    Specify this if you want to launch WINWORD in foreground.
```