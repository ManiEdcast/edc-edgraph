// do not use es6 syntax in this file as it doesn't handled by babel
window._webConstants = {{{env_vars}}};
//  <<< START register service worker

// In production, we register a service worker to serve assets from local cache.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.
// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

// IE9+ CustomEvent polyfill
(function() {
  if (typeof window.CustomEvent === 'function') return false; //If not IE
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
// <<< END register service worker

var remoteStyles = [
  'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i',
  '{{css}}'
];

var remoteScripts = ['{{common}}', '{{bootstrap}}', '{{app}}'];
console.log('in view.js')

// Asynchronously load CSS & JS with a Request Animation Frame
window.requestAnimationFrame(function() {
  var elementToInsertJSBefore = document.getElementsByTagName('head')[0].firstChild;
  var elementToInsertCSSBefore = document.getElementsByTagName('head')[0];
  for (var i = 0; i < remoteStyles.length; i++) {
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.media = 'all';
    linkElement.href = remoteStyles[i];
    elementToInsertCSSBefore.parentNode.insertBefore(linkElement, elementToInsertCSSBefore.nextSibling);
  }
  for (var i = 0; i < remoteScripts.length; i++) {
    var scriptElement = document.createElement('script');
    scriptElement.async = false;
    scriptElement.defer = true;
    scriptElement.type = 'application/javascript';
    scriptElement.src = remoteScripts[i];
    elementToInsertJSBefore.parentNode.insertBefore(scriptElement,elementToInsertJSBefore);
  }
});
