
"=============================".writeln();
"Test of the inline exception.".writeln();
"=============================".writeln();

try {

    // Exception initiation: 'y' is not defined
    x = 1 / y;

} catch (e) {

    // Exception message assertation
    "ASSERTED: Undefined variable".writeln();
    e.format().writeln();

}

"============================".writeln();
"Test of internal exceptions.".writeln();
"============================".writeln();

function myErrorHandler(data)
{
    var e;
    try {

        if (typeof(data) == "undefined") {
            throw new Error("UNDEFINED");
        }

        if (typeof(data) != "number") {
            throw new Error("NOT_NUMBER");
        }

        if (data < 0) {
            throw new Error("NEGATIVE");
        }

        if (data == 0) {
            throw new Error("ZERO_NUMBER");
        }

        ("\nOK! " + data).writeln();

    } catch (e) {

        e.format().writeln();

    }
}

myErrorHandler();
myErrorHandler("abc");
myErrorHandler(-2);
myErrorHandler(0);
myErrorHandler(2);

