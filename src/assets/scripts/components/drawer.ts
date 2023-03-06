import { Controller } from '@hotwired/stimulus';
import * as spx from 'spx';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */
export class Drawer extends Controller {

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
  static targets = ['overlay'];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    if(this.element.classList.contains('hidden')) {
        this.element.classList.remove('hidden')
    }
  }

  /**
   * Stimulus Connect
   */
  public connect () {
    this.attachListeners();
    
    spx.on('load', () => {
        this.removeListeners();
        if(this.isOpenValue) setTimeout(this.close, 100);
        setTimeout(
          this.attachListeners(),
          100
        )
    });
  }

  attachListeners() {
    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].addEventListener('click', this.toggle);
    }
  }
  removeListeners() {
    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].removeEventListener('click', this.toggle);
    }
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {
    this.removeListeners();
  }

  toggle = (event: MouseEvent) => {
    event.preventDefault();

    if(event.target instanceof Element) {
        if (event.target.getAttribute('data-spinner') === 'true') {
            event.target.classList.add('loading');
        }
    }

    this.isOpenValue = !this.isOpenValue;

    return this.isOpenValue ? this.open() : this.close();
  };

  click (event: MouseEvent) {
    if (this.isOpenValue) this.close();
  }

  touchMove = (event: TouchEvent) => {
    if (this.isOpenValue) {
        if(this.element.scrollHeight <= this.element.clientHeight) {
            event.preventDefault();
        }
    }

  }

  touchStart({ target }: TouchEvent) {
    if(target instanceof HTMLElement) {
        const { scrollTop, offsetHeight } = target;
        const position = scrollTop + offsetHeight;

        if(scrollTop === 0) {
            target.scrollTop = 1;
        } else if (position === scrollTop) {
            target.scrollTop = scrollTop - 1;
        }
    }
  }

  keyboard = (event: KeyboardEvent) => {
    if(event.keyCode === 27 || event.keyCode === 32) {
        this.close();
    }
  }

  open = () => {
    this.application.element.classList.add('drawer-open');
    // Consider an overlay listener here.

    if (this.element instanceof HTMLElement) {
        this.element.focus();
        this.element.setAttribute('aria-hidden', String(false));
        this.element.addEventListener('touchstart', this.touchStart, { passive: true })
        this.element.classList.add('drawer-active');
    }
  }

  close() {
    console.log('Attempt Drawer Close');
    this.application.element.classList.remove('drawer-active');

    if (this.element instanceof HTMLElement) {
        this.element.setAttribute('aria-hidden', String(true))
        this.element.classList.remove('drawer-active')
        this.element.removeEventListener('touchstart', this.touchStart);
        // If overlay listener is added - remove it here.
    }
  }




  get buttons() {
    return this.application.element.lastElementChild.querySelectorAll(`button[aria-controls="${this.element.id}"]`);
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */
  isOpenValue: boolean;
}
