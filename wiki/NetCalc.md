_Network Calculator is a tool for calculating of IP addresses of subnets._



# Introduction #

This tool was designed to calculate different parts of networks. Entering an IP address and a possible subnet mask you will see immediately all parameters for the defined subnet:
  * the network address
  * the broadcast address
  * the first and the last addresses of the subnet
  * the number of available addresses
  * the same values in different radices

# Details #

Even though it was developed as a simple hyper-text application for Windows (HTA) there are no limits to open it as a simple HTML page under Firefox within another opersting system because the tool was successfully tested under Firefox within Windows.

Simply change the extension from `.hta` to `.htm` or `.html` and try to open it in a borwser.

The main window consists of three logical parts. Let's consider all parts separately.

![http://jsxt.googlecode.com/svn/wiki/NetCalc.jpg](http://jsxt.googlecode.com/svn/wiki/NetCalc.jpg)

## Request ##

`Request` is the area where a user can enter information.

## Address ##

`Address` is the area displaying details of the entered IP address: the address itself, subnet mask (in the direct and inverse form), the bitmask.

## Network ##

`Network` is the area displaying the network address, the broadcast address, the first and the last available addresses, the number of available addresses (each available address from the interval, where the first and the last are shown here)

# Summary #

The tool is open and free for use.

The working test version is available by the link - [NetCalc.hta](http://jsxt.googlecode.com/svn/trunk/NetCalc.hta). The standalone version can be downloaded from the [Downloads](http://code.google.com/p/jsxt/downloads/list).

Comments and requests for fixing of bugs and making it better are welcome.