import { Controller } from '@hotwired/stimulus';
import { changeCartItemByLine, updateCart } from 'src/assets/scripts/modules/cart';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class ItemQuantity extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    line: Number,
    id: String,
  };

  /**
   * Stimulus Targets
   */
  static targets = ['input', 'minus', 'plus', 'remove'];

  /**
   * Stimulus Outlets
   */
  static outlets = ['cartform'];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    console.log('Initialize Item Quantity', this.cartformOutlets, this.lineValue, this.idValue);
  }

  /**
   * Stimulus Connect
   */
  public connect () {
    (this.hasMinusTarget) && this.minusTarget?.addEventListener('click', () => this.decrease());
    (this.hasPlusTarget) && this.plusTarget?.addEventListener('click', () => this.increase());
    (this.hasRemoveTarget) && this.removeTarget?.addEventListener('click', (event) => this.remove(event));
    (this.hasInputTarget) && this.inputTarget?.addEventListener('change', (event: InputEvent) => this.updateInputValue(event.target.value));
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}

  public async updateInputValue(value) {
    if (this.hasInputTarget) this.inputTarget.value = value;


    let body = JSON.stringify({
        line: this.lineValue,
        quantity: value,
    });

    let update = await changeCartItemByLine(body)

    this.element.dispatchEvent(new CustomEvent('update', {
        detail: update,
        bubbles: true
    }))

    console.log('Cart Update:', update);

  }

  public async remove(event: MouseEvent) {
    const { currentTarget } = event;
    const { dataset: { transactionId } } = currentTarget;

    // Trigger Transition event to the cart_form here.

    if(!transactionId) return this.updateInputValue(0);

    // Parent outlet
    const parentOutlet = this.cartformOutlets.find((outlet) => outlet.scope.containsElement(currentTarget))
    const bundleItems = parentOutlet.itemTargets.filter(($item) => $item.dataset.transactionId === transactionId);
  
    // This should be a group remove function.
    const updates = bundleItems.reduce((removes, $item) => {
      const { dataset: { key } } = $item;

      removes[key] = 0;
      return removes;
    }, {})

    this.element.dispatchEvent(new CustomEvent('remove', {
        detail: {
          items: bundleItems,
        },
        bubbles: true
    }))

    const cart = await updateCart(JSON.stringify({updates}));

    this.element.dispatchEvent(new CustomEvent('update', {
        detail: cart,
        bubbles: true
    }))
    // console.log('Remove', { updates, parentOutlet, cart, bundleItems, currentTarget, transactionId })
  }

  public increase(by = 1) {
    this.updateInputValue(
        Number(this.inputTarget.value) + by
    );
  }

  public decrease(by = 1) {
    this.updateInputValue(
        Math.max(Number(this.inputTarget.value) - by, 0)
    );
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */
  lineValue: Number;
  idValue: string

  // Targets
  inputTarget: HTMLInputElement;
  minusTarget: HTMLButtonElement;
  plusTarget: HTMLButtonElement;
  removeTarget: HTMLButtonElement;

  // Target
  hasInputTarget: boolean;
  hasMinusTarget: boolean;
  hasPlusTarget: boolean;
  hasRemoveTarget: boolean;

}
