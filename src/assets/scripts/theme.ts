import 'lazysizes';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
import AOS from 'aos'


// Animate on Scroll Library
AOS.init({
    offset: -125,
    once: true,
    delay: 5000
});

// Lazyload Templated event
document.addEventListener('lazybeforeunveil', (e: CustomEvent) => {
    const { target } = e;
    const { dataset } = target;
    const { srcTemplate, widths } = dataset;

    if(widths && widths.length) {
        let parts = widths.split(',');
        let srcs = [];
        for(let i =0; i < parts.length; i++) {
            let width = parts[i];
            srcs.push(
                srcTemplate.replace('[width]', `width=${width}`) + ` ${width}w`
            )
        }
        
        target.setAttribute('data-srcset', srcs.join(','))
    }
});

console.log('Theme js');