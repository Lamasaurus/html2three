function setupVR_newStyle() {
  if (navigator.vr) {
    window.addEventListener('navigate', function (event) {
      event.transitionUntil(event.newWindow.then(function (newWin) {
        if (!newWin) {
          return;
        }

        // See `document.interactive` spec and polyfill:
        // https://html.spec.whatwg.org/multipage/dom.html#dom-document-interactive
        // https://github.com/jonathantneal/document-promises
        return newWin.document.interactive.then(function () {
          return navigator.vr.getDisplays().then(function (displays) {
            if (!displays.length) {
              return;
            }

            var displayToPresent = displays.filter(function (display) {
              return display.wasPresenting;
            })[0];
            if (!displayToPresent) {
              return;
            }

            return displayToPresent.requestPresent({ source: canvas });
          });
        });
      }));
    });
  } else {
    window.addEventListener('load', function () {
      navigator.vr.getDisplays().then(function (displays) {
        if (!displays.length) {
          return;
        }

        var displayToPresent = displays[0];
        // XXX: To remember which `VRDisplay` was being presented to,
        // you could store the `VRDisplay`'s `displayName` + `displayId`
        // in a Service Worker or cross-origin w/ an
        // `<iframe>` + `sessionStorage`.
        if (!displayToPresent) {
          return;
        }

        return displayToPresent.requestPresent({ source: canvas });
      });
    });
  }
}