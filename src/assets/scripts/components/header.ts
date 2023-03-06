import { Controller } from '@hotwired/stimulus';
import { debounce } from 'application/utils';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Header extends Controller {
  /**
   * Stimulus Values
   */
  static values = {
    searchQuery: {
      type: String,
      default: '',
    }
  };
  /**
   * Stimulus Targets
   */
  static targets = ['mobileNav', 'mobileNavTier', 'searchInput', 'searchResults', 'searchResultsList'];


  /**
   * Stimulus OnValueChanged
   */
  async searchQueryValueChanged(newValue, oldValue) {


    if(newValue.length < 3) {
      this.searchResultsTarget.classList.remove(...['active', 'loading']);
      return this.searchResultsListTarget.innerHTML = '';
    }

    const {
      resources: {
        results: { products = [] }
      }
    } = await this.fetchSearchQuery(newValue);
    const slides = products.reduce((html, { featured_image, title, url }) => {
      return html += `
        <div class="embla-slide w-1/3 sm:w-1/4 lg:w-1/5 mr-2 relative flex flex-col items-center justify-center">
          <div class="w-full">
            <img
              class="lazyload w-full"
              data-src-template="${featured_image.url}&[width]"
              data-src="${featured_image.url}&width=10"
              sizes="40vw"
              data-widths="75,150,200,300,500" />
          </div>
          <p class="mt-2 font-bold text-sm">${title}</p>
          <a href="${url}" class="pseudo-link"></a>
        </div>
      `
    }, '') 

    this.searchResultsTarget.classList.remove('loading');
    this.searchResultsListTarget.innerHTML = `
    <div
    class="embla overflow-hidden flex"
    data-carousel-contain-scroll-value="trimSnaps"
    data-controller="carousel"
    data-action="resize@window->carousel#screen">
      <div class="embla__container flex [&_.embla-slide]:flex-shrink-0 [&_.embla-slide]:flex-grow-0">
        ${slides}
      </div>
    </div>
  `
    

    console.log('Data:', products);
  }

  fetchSearchQuery(query) {
    return fetch(`/search/suggest.json?q=${query}&resources[type]=product&resources[limit]=10`).then((res) => res.json());
  }


  /**
   * Stimulus Initialize
   */
  public initialize () {}

  /**
   * Stimulus Connect
   */
  public connect () {
    window.addEventListener('scroll', this.scroll.bind(this));
    this.scroll();
    this.searchQueryValueChanged = debounce(
      this.searchQueryValueChanged.bind(this),
      150
    )
    this.searchInputTarget.addEventListener('input', this.onSearchInput.bind(this));
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {
    window.removeEventListener('scroll', this.scroll);
  }

  onSearchInput({ target }: MouseEvent) {
    console.log('Search Input', this.searchQueryValue);
    this.searchQueryValue = target.value;
    if(this.searchQueryValue.length > 2) {
      this.searchResultsTarget.classList.add(...['active', 'loading']);
    }
  }

  scroll() {
    const $el = this.element.closest('.shopify-section') || this.element;

    if(window.scrollY > 15) {
      $el.classList.add('stuck');
      this.element.classList.add('stuck');
    } else {
      $el.classList.remove('stuck');
      this.element.classList.remove('stuck');
    }
  }

  /**
   * This is called from the DOM on the `data-action="resize@window->carousel#screen"`
   * attribute.
   */
  public screen () {}

  toggle = ({ target }: MouseEvent) => {
    let isExpanded = target.getAttribute('aria-expanded') === 'true';
    target.setAttribute('aria-expanded', String(!isExpanded));

    if(!isExpanded) this.searchInputTarget.focus()
  }

  onMobileClick = ({ target }: MouseEvent) => {
    const $btn = target;
    const $subMenu = $btn.nextElementSibling;

    if($subMenu) {
      const $temp = document.createElement('div');
      $temp.appendChild($subMenu.cloneNode(true));
      this.mobileNavTierTarget.querySelector('.wrapper').innerHTML = $temp.innerHTML;
    }

    this.mobileNavTarget.classList.toggle('active');
  }

  clearSubMenu() {
    this.mobileNavTarget.classList.toggle('active');
  }

  enterGrandChild(event) {
    const $link = event.target
    const $column = $link.closest('.megamenu-item')
    const $img = $column.querySelector('.mega-item-image img')
    const src = $link.dataset.img;

    if(src) $img.src = src;
  }

  leaveGrandChild(event) {
    const $link = event.target;
    const $column = $link.closest('.megamenu-item')
    const $img = $column.querySelector('.mega-item-image img')
    const $main = $column.querySelector('.category-main')
    const src = $main.dataset.img

    if(src) $img.src = src;
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  active: boolean;
  searchQueryValue: string;

  declare readonly mobileNavTierTarget: HTMLElement;
  declare readonly mobileNavTarget: HTMLElement
  declare readonly searchResultsTarget: HTMLElement
  declare readonly searchResultsListTarget: HTMLElement
  declare readonly searchInputTarget: HTMLElement;
}
