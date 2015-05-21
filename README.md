#Payir Patient Management

A patient management system for small organisations/community health centres that supports storing patient information and visit history, and reminders to follow up on patients after a few days, delivered by SMS to a team of health workers using Google Calendar API.

![Image](http://i.imgur.com/NpAwBHO.gif)

If you find this software useful, please consider donating to [Payir](http://payir.org)

#Index
* <a href="#installation">Installation</a>
    * <a href="#release-build">Release Build</a>
    * <a href="#development">Development</a>
* <a href="#dependencies">Dependencies</a>
* <a href="#licence">Licence</a>


##Installation

###Release Builds

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

To create packages for Windows and Linux separately, do this
```
grunt dist-linux64 #Linux 64-bit
grunt dist-linux32
grunt dist-win
```

To create all release builds at once, do this
```
grunt distAll
```
Packages are created in the appropriate `dist` folder

Note: Windows file names have a 260 char limit. The nested dependencies of node_modules can [cause issues while packaging](https://github.com/mllrsohn/node-webkit-builder/issues/107) the Windows release build. To avoid a nw:blank app, install `flatten-packages` (`npm install -g flatten-packages`) and run it on the app directory
```
flatten-packages app/
```

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