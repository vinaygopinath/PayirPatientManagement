#Payir Patient Management

A patient management system for small organisations that lets you store patient information, visit history and prescriptions, and set up reminders to follow up on patients after a few days, delivered as an SMS to your team using Google Calendar API.

#Index
* <a href="#installation">Installation</a>
    * <a href="#release-build">Release Build</a>
    * <a href="#development">Development</a>
* <a href="#dependencies">Dependencies</a>
* <a href="#licence">Licence</a>


##Installation

###Release Build

Coming soon

###Development

Download this repo and set up dependencies using `npm` and `bower`

```
npm install
bower install
```

This app uses nw (formerly known as node-webkit). You can install it using
```
npm install -g nw
```

Run the app using
```
nw /path/to/app/directory
```

To create packages for Windows and Linux, do this
```
grunt dist-linux #Linux 64-bit
grunt dist-linux32
grunt dist-win
```
Packages are created in the appropriate `dist` folder

##Dependencies

This app uses the following external tools and dependencies
<ul>
    <li>
    <a href="http://nwjs.io/" target="_blank">NW</a> aka node-webkit
    </li>
    <li>
        <a href="https://github.com/louischatriot/nedb" target="_blank">NEDB</a>: A client-side database for node apps
    </li>
    <li>
        <a href="https://material.angularjs.org/" target="_blank">Material Design</a> by Google
    </li>
</ul>
##Licence

The MIT License (MIT)

Copyright (c) 2015 Vinay Gopinath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.