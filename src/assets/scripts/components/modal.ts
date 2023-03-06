import { Controller } from '@hotwired/stimulus';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */
export class Modal extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    isOpen: Boolean,
    isReady: Boolean,
  };

  /**
   * Stimulus Targets
   */
  static targets = ['body', 'closer'];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    console.log('Initialize Modal', this.closerTarget);
  }

  /**
   * Stimulus Connect
   */
  public connect () {
    this.active = this.element.getAttribute('aria-hidden') === 'false';
    this.buttons.forEach(($btn) => $btn.addEventListener('click', this.open.bind(this)))
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    this.closerTarget.addEventListener('click', this.close.bind(this));
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {
    document.removeEventListener('click', this.handleOutsideClick);
    this.closerTarget.removeEventListener('click', this.close);
  }

  handleOutsideClick(event) {
    if(!this.active || [...this.buttons].includes(event.target)) return;
    if(event.target === this.element || !this.bodyTarget.contains(event.target)) this.close();
  }
 
  public open(event) {
    event.preventDefault();

    this.element.setAttribute('aria-hidden', 'false');
    this.active = true;
  }

  public close() {
    this.element.setAttribute('aria-hidden', 'true');
    this.active = false;
  }

  get buttons() {
    return document.querySelectorAll(`button[aria-controls="${this.element.id}"],a[href="/cart"]`);
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */
  active: boolean;
  isOpenValue: boolean;

  bodyTarget: HTMLElement | null;
  closerTarget: HTMLElement | null;
}
