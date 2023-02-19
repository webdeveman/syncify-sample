import * as spx from 'spx';
import * as viewport from 'qvp';
import { Controller as stimulus } from './controller';
import { ssm } from './utils';


export function app ({ targets, screens, controllers }) {

  spx.connect({
      targets,
      hover: {
        trigger: 'href',
        threshold: 100
      }
  })(function(session) {

   /**
     * Stimulus Instance
     */
   stimulus.connect(controllers);

   /**
    * Register Responsive States
    */
   viewport.screens(ssm(screens));

  });

  spx.on('prefetch', (state) => {

    console.log('THIS WILL INVOKE FOR EVERY PREFETCH', state)

  })

  spx.on('load', (state) => {

    console.log('THIS IS SPX STATE:', state)

  })

}

