import spx from 'spx';

spx.connect({
    targets: ['body'],
    timeout: 30000,
    schema: 'spx',
    cache: true,
    limit: 100,
    preload: null,
    async: true,
    annotate: false,
    hover: {
      trigger: 'attribute',
      threshold: 250
    },
    intersect: {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0
    },
    proximity: {
      distance: 75,
      threshold: 250,
      throttle: 500
    },
    progress: {
      background: '#111',
      height: '3px',
      minimum: 0.09,
      easing: 'linear',
      speed: 300,
      trickle: true,
      threshold: 500,
      trickleSpeed: 300
    }
})(function(session) {

    // The connect returns a callback function after
    // connection was established. Lets inspect the session:
    console.log('spx session', session);
  
    // You initialize third party js in this callback
    // It's the equivalent of DOMContentLoaded.
    
});
console.log('Spx Connect', spx);
