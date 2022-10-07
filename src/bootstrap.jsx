// Define a temporary hash for the user
window.tempHash = new Date().getTime().toString() + document.location.hostname;

/**
 * Our LaunchDarkly anonymous client
 * Useful for toggles on Login pages
 * We create a temporary hash to define an anomymous user
 * and "bootstrap" to localStorage to speed up the "ready" event
 * NOTE: You can load a specifc org locally by changing
 * org: document.location... => org: 'name'
 * @example org: 'labs' - will load our labs.cmnetwork.co org LD config
 */



// Google Tag Manager
window.triggerGTM = GTMId =>
  setTimeout(() => {
    const gtmIDs = ['', GTMId]; // add id later if required
    gtmIDs.forEach(gtmID => {
      if (gtmID != 'false' && !document.getElementById(gtmID)) {
        const firstScriptTag = document.getElementsByTagName('script')[0];
        const scriptTag = document.createElement('script');

        const dataLayer = 'dataLayer';
        const dl = '&l=' + dataLayer;

        window[dataLayer] = window[dataLayer] || [];
        window[dataLayer].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

        scriptTag.defer = true;
        scriptTag.id = gtmID;
        scriptTag.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtmID + dl;

        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
      }
    });
  }, 4000);
// End Google Tag Manager
