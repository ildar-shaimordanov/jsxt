try {

    // Exception initiation: 'y' is not defined
    x = 1 / y;

} catch (e) {

    // Exception message assertation
    ASSERT("ASSERTED: Undefined variable");
    ASSERT(e);

}


function myErrorHandler(data)
{
    try {

        if (typeof(data) == "undefined") {
            throw "UNDEFINED";
        }
        if (typeof(data) != "number") {
            throw "NOT_NUMBER";
        }
        if (data < 0) {
            throw "NEGATIVE";
        }
        if (data == 0) {
            throw "ZERO_NUMBER";
        }
        ASSERT("\nOK! " + data);

    } catch (e) {

        ASSERT(e);

    }
}

myErrorHandler();
myErrorHandler("abc");
myErrorHandler(-2);
myErrorHandler(0);
myErrorHandler(2);

