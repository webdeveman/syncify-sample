import { Controller } from '@hotwired/stimulus';
import embla, { EmblaCarouselType } from 'embla-carousel';
import * as vp from 'qvp';
import { parseScriptTag } from 'application/utils';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Carousel extends Controller {
  /**
   * Stimulus Values
   */
  static values = {
    align: {
      type: String,
      default: 'start'
    },
    axis: {
      type: String,
      default: 'x'
    },
    breakpoint: String,
    breakpointSettings: {
      type: Object,
      default: {}
    },
    dragFree: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    highlight: {
      type: Boolean,
      default: false
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
  static targets = ['breakpoints'];

  /**
   * Stimulus Outlets
   */
  static outlets = ['carousel'];

  syncControllers() {
    const pair = this.carouselOutlet.carousel;
    const thumbSlides = pair.slideNodes();
    
    thumbSlides.forEach((slideNode, index) => {
      slideNode.addEventListener('click',() => {
        this.carousel.scrollTo(index);
      })
    })

    this.carousel.on('select', () => {
      pair.scrollTo(
        this.carousel.selectedScrollSnap()
      )
    })
  }

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

  updateInView() {
    const $slides = this.carousel.slideNodes();
    const inView = this.carousel.slidesInView();

    for(let i = 0; i < $slides.length; i++) {
      let $slide = $slides[i];
      let position = inView.indexOf(i);

      // clean.
      $slide.classList.remove('edge');

      if(position === 0 || position === inView.length - 1) $slide.classList.add('edge');

      if(inView.includes(i)) {
        $slide.classList.add('embla-active')
        $slide.classList.remove('embla-inactive')
      } else {
        $slide.classList.remove('embla-active')
        $slide.classList.add('embla-inactive')
      }
    }
  }

  /**
   * This is called from the DOM on the `data-action="resize@window->carousel#screen"`
   * attribute.
   */
  public screen () {

    if (!this.active && this.enabled) {

      if(this.hasBreakpointsTarget) {
        const { breakpoints } = parseScriptTag(this.breakpointsTarget);
        this.breakpointsTarget.parentElement.removeChild(this.breakpointsTarget);
        this.breakpointSettingsValue = breakpoints;
      }

      // console.log('Carousel Screen:', breakpoints, this.breakpointSettingsValue);

      this.active = true;
      this.carousel = embla(this.element as HTMLElement, {
        align: this.alignValue,
        axis: this.axisValue,
        breakpoints: this.breakpointSettingsValue,
        draggable: this.draggableValue,
        dragFree: this.dragFreeValue,
        skipSnaps: this.skipSnapsValue,
        containScroll: this.containScrollValue,
        speed: this.speedValue,
        startIndex: this.startIndexValue,
        loop: this.loopValue
      });
      

      if(this.hasCarouselOutlet) {
        this.syncControllers();
      }

      this.carousel.on('init', this.updateInView.bind(this))
      this.carousel.on('settle', this.updateInView.bind(this))
      this.carousel.on('scroll', this.updateInView.bind(this))

    } else if (this.active && !this.enabled) {
      this.carousel.destroy();
      this.active = false;
    }

  }

  /**
   * Carousel - Next
   */
  public next () {
    // console.log('Next');
    this.carousel.scrollNext();

  }

  /**
   * Carousel - Previous
   */
  public prev () {
    // console.log('Prev');
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
  carouselOutlet: HTMLElement | null;

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
  breakpointsTarget: HTMLElement | null;
  hasCarouselOutlet: boolean;
  hasBreakpointsTarget: boolean;

  /**
   * Stimulus: Axis for carousel
   */
  axisValue: string;

  /**
   * Stimulus: The screen size at which to apply carousel
   */
  breakpointValue: string;

  /**
   * Stimulus: The screen size at which to apply carousel
   */
  breakpointSettingsValue: object;

  /**
   * Stimulus: Whether or not a breakpoint size was provided, when `false` runs in any breakpoint.
   */
  hasBreakpointValue: boolean;
  /**
   * Embla carousel `draggable` option.
   */
  alignValue: string;
  /**
   * Custom Embla carousel `draggable` option.
   */
  highlightValue: boolean;

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
