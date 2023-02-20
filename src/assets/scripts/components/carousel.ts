import { Controller } from '@hotwired/stimulus';
import embla, { EmblaCarouselType } from 'embla-carousel';
import * as vp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Carousel extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    breakpoint: String,
    dragFree: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: false
    },
    skipSnaps: {
      type: Boolean,
      default: false
    },
    containScroll: {
      type: String,
      default: ''
    },
    startIndex: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 10
    }
  };

  /**
   * Stimulus Targets
   */
  static targets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {

    this.active = false;

  }

  /**
   * Stimulus Connect
   */
  public connect () {

    // console.log('Carousel Stimulus Connect');
    if (this.enabled && !this.active) this.screen();

  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {

    if (this.active && this.enabled) this.carousel.destroy();

  }

  /**
   * Whether or not the carousel should be enabled
   */
  get enabled () {
    return this.hasBreakpointValue ? vp.test(this.breakpointValue, '|') : true;
  }

  /**
   * This is called from the DOM on the `data-action="resize@window->carousel#screen"`
   * attribute.
   */
  public screen () {

    if (!this.active && this.enabled) {

      this.active = true;
      this.carousel = embla(this.element as HTMLElement, {
        align: 'start',
        draggable: this.draggableValue,
        dragFree: this.dragFreeValue,
        skipSnaps: this.skipSnapsValue,
        containScroll: this.containScrollValue,
        speed: this.speedValue,
        startIndex: this.startIndexValue,
        loop: this.loopValue
      });

    } else if (this.active && !this.enabled) {
      this.carousel.destroy();
      this.active = false;
    }

  }

  /**
   * Carousel - Next
   */
  public next () {

    this.carousel.scrollNext();

  }

  /**
   * Carousel - Previous
   */
  public prev () {

    this.carousel.scrollPrev();

  }

  /**
   * Siema
   *
   * Goto Slide
   */
  public goto ({ target }: { target: HTMLButtonElement}) {

    this.carousel.scrollTo(Number(target.id));

  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * Photoswipe: Template Element
   */
  template: Element;
  /**
   * Carousel Instance
   */
  carousel: EmblaCarouselType;
  /**
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  active: boolean;

  /* -------------------------------------------- */
  /* STIMULUS VALUES                              */
  /* -------------------------------------------- */

  /**
   * Stimulus: The screen size at which to apply carousel
   */
  breakpointValue: string;
  /**
   * Stimulus: Whether or not a breakpoint size was provided, when `false` runs in any breakpoint.
   */
  hasBreakpointValue: boolean;
  /**
   * Embla carousel `draggable` option.
   */
  draggableValue: boolean;
  /**
   * Embla carousel `dragFree` option.
   */
  dragFreeValue: boolean;
  /**
   * Embla carousel `loop` option.
   */
  loopValue: boolean;
  /**
   * Embla carousel `skipSnaps` option.
   */
  skipSnapsValue: boolean;
  /**
   * Embla carousel `containScroll` option.
   */
  containScrollValue: 'trimSnaps' | 'keepSnaps';
  /**
   * Embla carousel `startIndex` option.
   */
  startIndexValue: number;
  /**
   * Embla carousel `speed` option.
   */
  speedValue: number;

}
