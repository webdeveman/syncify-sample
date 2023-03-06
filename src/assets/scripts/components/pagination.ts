import { Controller } from '@hotwired/stimulus';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */
export class Pagination extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    container: {
        type: String,
        default: ''
    }
  };

  /**
   * Stimulus Targets
   */
  static targets = [];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    let options = {
        rootMargin: (window.innerHeight * .5) + 'px',
    }

    this.loading = false;

    this.intersectionObserver = new IntersectionObserver(entries => this.processIntersectionEntries(entries), options);
  }

  processIntersectionEntries(entries) {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            this.loadMore();
        }
    })
  }

  fetchPage(url) {
    return fetch(url).then((res) => res.text());
  }

  async loadMore() {
    const $next = this.element.querySelector('.next');
    if(this.loading || !$next) return;
    this.loading = true;

    console.log('Before Query');
    const url = $next.href;
    const page = await this.fetchPage(url);
    console.log('After Query');
    const parser = new DOMParser();
    const $doc = parser.parseFromString(page, 'text/html');

    const $grid = $doc.querySelector(this.containerValue);
    const $pagination = $grid.nextElementSibling;
    const $children = $grid.children;

    for(let i = 0; i < $children.length; i++) {
        document.querySelector(this.containerValue).appendChild($children[i]);
    }
    console.log('After Append Query');

    if($pagination) {
        const $newNext = $pagination.querySelector('.next');
        if($newNext) {
            $next.href = $newNext.href;
            this.loading = false;
        } else {
            this.element.style.display = 'none';
            this.disconnect();
        }
    }

  }

  /**
   * Stimulus Connect
   */
  public connect () {
    this.intersectionObserver.observe(this.element);
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {
    this.intersectionObserver.unobserve(this.element);
  }


  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /** data-pagination-container-selector
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  active: boolean;

  /**
   * Container for AJAX Pagination
   */
  containerValue: string;
  loading: boolean;
  intersectionObserver: IntersectionObserver;
}
