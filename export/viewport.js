var page = require('webpage').create(), address, output, sizeX, sizeY;

if (phantom.args.length < 4 || phantom.args.length > 5) {
  console.log('Usage: phantomjs viewport.js URL filename sizeX sizeY');
  phantom.exit();
}
else {
  address = phantom.args[0];
  output = phantom.args[1];
  sizeX = phantom.args[2];
  sizeY = phantom.args[3];

  page.viewportSize = { width: sizeX, height: sizeY };

  page.open(address, function (status) {
    if (status !== 'success') {
      console.log('Unable to load the address!');
      phantom.exit();
    }
    else {
      window.setTimeout(function () {
        page.render(output);
        phantom.exit();
      }, 2500);
    }
  });
}
