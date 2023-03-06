import { Controller } from '@hotwired/stimulus';
import Cookies from 'js-cookie';
import { debounce, sleep } from 'application/utils';

import { updateCart, applyCartDiscount } from '../modules/cart';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class CartForm extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    note: {
        type: String,
        default: '',
    }
  };

  async noteValueChanged(newValue, oldValue) {
    await updateCart(JSON.stringify(
        { note: newValue }
    ));

    this.noteTarget.classList.remove('is-editing');

    if(newValue.length) {
        this.noteTarget.classList.add('is-success');
        await sleep(2500);
        this.noteTarget.classList.remove('is-success');
    }
  }

  /**
   * Stimulus Classes
   */
  static classes = ['removing'];

  /**
   * Stimulus Targets
   */
  static targets = ['field', 'item', 'note'];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    this.noteValueChanged = debounce(
        this.noteValueChanged.bind(this),
        350,
    )
  }

  /**
   * Stimulus Connect
   */
  public connect () {
    console.log('CartForm Connect:', this.itemTargets);
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}

  async sendCartUpdate(name, value) {
    let update = await updateCart(JSON.stringify(
        { [name]: value }
    ));

    console.log('send cart update', update);
  }


  removeItems(event) {
    console.log('Cart is triggering remove items', event.detail);
    const { items } = event.detail;

    items.forEach((item) => item.classList.add(...this.removingClasses))
  }

  onNoteInput(event) {
    const { value } = event.target;

    event.target.classList.add('is-editing');
    (value.length) ? event.target.classList.add('is-valid') : event.target.classList.remove('is-valid');
    // this.sendCartUpdate(name, value)
    this.noteValue = value;
  }

  onDiscountInput(event) {
    const { value } = event.target;

    (value.length) ? event.target.classList.add('is-valid') : event.target.classList.remove('is-valid');
    Cookies.set('discount_code', value);
    console.log('on discount:', value, Cookies.get('discount_code'))
  }
  
  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  
  /* -------------------------------------------- */
  /* Stimulus Value s                             */
  /* -------------------------------------------- */
  noteValue: string;

  /* -------------------------------------------- */
  /* Stimulus Targets                             */
  /* -------------------------------------------- */
  declare readonly itemTargets: HTMLElement[];
  declare readonly fieldTargets: HTMLElement[];
  declare readonly noteTarget: HTMLElement;

}
