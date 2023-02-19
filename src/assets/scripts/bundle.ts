import { app } from 'application/app';
import { Carousel } from 'components/carousel'
import { Accordion } from 'components/accordion'

export default app({

  /**
   * Small wrapped for defining target which will change
   * on a per-page basis which SPX should invoke
   */
  targets: [
    '#main',
    '#navbar'
  ],

  /**
   * This allows us to define different viewports and apply
   */
  screens: {
    xs: '(max-width: 576px)',
    sm: '(min-width: 577px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 991px)',
    lg: '(min-width: 992px) and (max-width: 1199px)',
    xl: '(min-width: 1200px) and (max-width: 1399px)',
    xxl: '(min-width: 1400px)'
  },

  /**
   * Here is where we will add all our Stimulus controllers.
   */
  controllers: {
    Accordion,
    Carousel
  }
});
