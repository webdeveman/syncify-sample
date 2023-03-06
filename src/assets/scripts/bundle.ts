import { app } from 'application/app';

// Stimulus Controllers
import { Accordion } from 'components/accordion'
import { Carousel } from 'components/carousel'
import { Drawer } from 'components/drawer';
import { Dropdown } from 'components/dropdown';
import { Header } from 'components/header';
import { ItemQuantity } from 'components/item-quantity';
import { Modal } from 'components/modal';
import { Pagination } from 'components/pagination';
import { Product } from 'components/product-form';
import { CartForm } from 'components/cart-form'
import { Section } from 'components/section';
import { Zoom } from 'components/zoom';


export default app({
  /**
   * Small wrapped for defining target which will change
   * on a per-page basis which SPX should invoke
   */
  targets: [ 
    '#shopify-section-header',
    '#main'
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
    CartForm,
    Carousel,
    Drawer,
    Dropdown,
    Header,
    ItemQuantity,
    Modal,
    Pagination, 
    Product,
    Section,
    Zoom,
  }
});
