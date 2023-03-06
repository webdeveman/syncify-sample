import { Controller } from '@hotwired/stimulus';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */
export class Dropdown extends Controller {
  /**
   * Stimulus Values 
   */ 
  static values = {
    formId: {
        type: String,
        default: '',
    }
  };

  /**
   * Stimulus Targets
   */
  static targets = ['button', 'options', 'option'];

  /** 
   * Stimulus Outlets
   */
  static outlets = []; 

  outsideClick(event) {
    // console.log('Outside Click:', {
    //   target: event.target,
    //   button: this.buttonTarget,
    //   hasClass: this.element.classList.contains('opened')
    // })
    if (this.buttonTarget !== event.target && this.element.classList.contains('opened')) this.close(event);
  }

  close(event) {
    this.element.classList.remove('opened');

    if (this.status === 'selected' || this.status?.length > 0) {
      this.element.classList.add('selected');
    } else {
      this.status = 'closed';
    }

    document.removeEventListener('click', this.outsideClick.bind(this));
  }

  toggle(event = null) {
    if(event !== null) {
      // Commented this because I want the inputs to toggle as well.
      event.preventDefault();
      event.stopPropagation();
    }

    if(this.element.classList.contains('opened')) return this.close(event);

    this.element.classList.add('opened');
    this.buttonTarget.classList.remove('selected');
    // events.opened.forEach(cb => cb({ element, options }, event || { target: button }))


    document.addEventListener('click', this.outsideClick.bind(this));
  }

  items(event) {
    event.preventDefault();
    event.stopPropagation();

    if(event.target instanceof HTMLElement) {
      const { currentTarget, target } = event;
      const params = {};

      console.log('Clicked Dropdown Item:', target);

      if(currentTarget instanceof HTMLElement) {
        const [ selected ] = currentTarget.getElementsByClassName('selected');
        const { name, value } = event.target.nextElementSibling;
        this.select = event.target.textContent;
        this.buttonTarget.textContent = event.target.textContent;
        this.status = 'selected';
        event.target.nextElementSibling.checked = true;

        this.trigger('select', {
          selected,
          target: event.target.nextElementSibling,
          name,
          value,
        });

        // events.select.forEach(cb => cb({ element, selected, button, status }, event))
      }

      this.toggle(event);
    }
  }

  trigger(name, data) {
    this.element.dispatchEvent(new CustomEvent(name, {
      detail: data,
      bubbles: true
    }))
  }

  /**
   * Stimulus Initialize
   */ 
  public initialize (): void {
    this.optionsTarget.addEventListener('click', this.items.bind(this));
    this.buttonTarget.addEventListener('click', this.toggle.bind(this));
  }

  /**
   * Stimulus Connect
   */
  public connect () {}

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /** 
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  formIdValue: string;

  select: string;
  status: string;


  // These are all html element(s) via Stimulus target attr.
  buttonTarget: any;
  optionsTarget: any;
  optionTargets: any;
}
