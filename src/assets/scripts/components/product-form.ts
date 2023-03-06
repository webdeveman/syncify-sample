import { Controller } from '@hotwired/stimulus';
import { formatMoney, parseScriptTag } from 'application/utils';
import { addItemsToCart, transformFormDataForCart } from '../modules/cart';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */
export class Product extends Controller {
  /**
   * Stimulus Values 
   */ 
  static values = {
    formId: {
        type: String,
        default: '',
    },
    options: {
      type: Object,
      default: {
        option1: null,
        option2: null,
        option3: null,
      }
    },
    addonCache: {
      type: Object,
      default: {}
    }
  };

  /**
   * Stimulus Targets
   */
  static targets = ['addon', 'addons', 'form', 'model', 'productModel','prices', 'options', 'submit'];

  /** 
   * Stimulus Outlets
   */
  static outlets = ['drawer', 'section']; 

  getVariantFromOptions() {
    return [...this.product.variants].find((variant) => {
        return [...Object.entries(this.optionsValue)].every(
          ([key, value]) => variant[key] === value
        )
    })
  }

  getClosestVariantFromOptions() {
    return [...this.product.variants].find((variant) => {
        return [...Object.entries(this.optionsValue)].some(
          ([key, value]) => variant[key] === value
        )
    })
  }
  
  fetchAddonModules(id) {
    return this.addonCacheValue[id] ?  this.addonCacheValue[id] : fetch(`/products/${this.product.handle}?variant=${id}&view=variant-addons`).then((res) => res.text()).then((html) => {
      const parser = new DOMParser();
      const $doc = parser.parseFromString(html, 'text/html');

      this.addonCacheValue[id] = $doc.querySelector('#addon-container');

      return $doc.querySelector('#addon-container');
    });
  }

  updatePrice() {
    // console.log('Update Price:', this.pricesTarget, { variant: this.variant, product: this.product });
    if(!this.variant) {
      this.pricesTarget.innerHTML = `
        <span>${formatMoney(this.product.price_min, '${{amount_no_decimals}}')} - ${formatMoney(this.product.price_max, '${{amount_no_decimals}}')}</span>
      `
    } else {
      this.pricesTarget.innerHTML = `
        <span>${formatMoney(this.variant.price, '${{amount_no_decimals}}')}</span>
      `
    }
  }

  updateAddonsPanel() {
    const variantAddons = this.metafields.variants.reduce((addons, v) => {
      if(v.id !== this.variant?.id) return addons;
      return v.metafields.map(({ handle }) => handle);
    }, []);

    function togglePanel($panel, enabled) {
      const $inputs = $panel.querySelectorAll('input,select');

      // console.log('TogglePanel:', $inputs, enabled);
      $panel.style.display = (enabled) ? 'block' : 'none';
      $inputs.forEach(($input) => $input.disabled = !enabled)
    }

    const $panels = this.addonTargets;
    for(let i = 0; i < $panels.length; i++) {
      let $panel = $panels[i];
      let { addon } = $panel.dataset;
      let enable = variantAddons.includes(addon);
      

      togglePanel($panel, enable);
      // $panel.style.display = (variantAddons.includes(addon)) ? 'block' : 'none';
    }

    // console.log('Update Addons Panel', { $panels, variantAddons, addons: this.addonTargets });
  }

  async handleOptionSelect(event) {
    const { detail } = event;
    const { value, target } = detail; 
    const { position } = target.dataset;

    this.optionsValue[position] = value;

    this.updatePrice();
    this.updateAddonsPanel();

    // const variant = this.getVariantFromOptions(); // || this.getClosestVariantFromOptions();
  }

  get variant() {
    return this.getVariantFromOptions();
  }

  /**
   * Stimulus Initialize
   */ 
  public initialize () {
    // console.log('Initialize Product Control', { outlet: this.sectionOutlet }, this.productModelTarget, { form: this.formTarget, addonTargets: this.addonTargets, targets: this.optionsTargets, metafields, product:this.product});

  }
  /**
   * Stimulus Connect
   */
  public connect () {
    const { product, metafields } = (this.productModelTarget) ? parseScriptTag(this.productModelTarget) : null;

    this.product = product;
    this.metafields = metafields;

    this.formTarget.addEventListener('submit', this.onSubmit)

    this.updateAddonsPanel = this.updateAddonsPanel.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}

  onSubmit = async (event: SubmitEvent) => {
    event.preventDefault(); // Stop standard submission in favor of AJAX if JS is enabled.
 
    if(!event.target.checkValidity()) return;

    const formData = new FormData(this.formTarget);
    const items = transformFormDataForCart(formData);
    // const data  = {};
    // formData.forEach((value, key) => data[key] = /(quantity|id)/i.test(key) ? Number(value) : value);

    // const { id, quantity } = data;
    // const items = [{ id, quantity }];

    const cart = await addItemsToCart({items});

    // Opens and Re-builds
    this.sectionOutlet.refresh();
    this.drawerOutlet.open();
    console.log('Submit Product Form:', { cart, items });
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /** 
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  addonCacheValue: any;
  formIdValue: string;
  product: any; // to lazy to make types. This is the Shopify product object.
  metafields: any; // to lazy to make types. This is a custom metafield object from the product-json snippet object.
  options: any;
  optionsValue: any;
  variant: any; // to lazy to make types. This is the Shopify product variant object.

  // These are all html element(s).
  addonTargets: HTMLElement[] | null;
  addonsTarget: HTMLElement | null;
  formTarget: HTMLFormElement | null;
  modelTarget: HTMLElement | null;
  pricesTarget: HTMLElement | null;
  productModelTarget: HTMLElement | null;
  optionsTarget: HTMLElement | null;
  optionsTargets: HTMLElement[] | null;
  submitTarget: HTMLElement | null;
}
