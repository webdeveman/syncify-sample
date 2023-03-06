import { Controller } from '@hotwired/stimulus';
import { sleep } from 'application/utils';

/* -------------------------------------------- */
/* CLASS                                        */
/* 
    This is a controller that utilizes the Shopify Section
    rendering API to update content w/o a refresh. Useful for 
    cart drawer interactions and production recommendations.

    Its possible to re-render certain elements within the section
    with Stimulus Targets === 'replace' and a set id.
*/
/* -------------------------------------------- */

export class Section extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    id: String,
  };

  /**
   * Stimulus Targets
   */
  static targets = ['replace'];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    this.loading = false;
  }

  /**
   * Stimulus Connect
   */
  public connect () {}

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}

  replaceTarget($replaceTarget: HTMLElement, $newSectionWrapper: HTMLElement) {
    if(!$replaceTarget.id) {
        console.warn(`Section Controller Error: Element needs an id to be replaced`, $replaceTarget);
        return;
    }

    if($newSectionWrapper.querySelector(`#${$replaceTarget.id}`)) {
      $replaceTarget.replaceWith(
          $newSectionWrapper.querySelector(`#${$replaceTarget.id}`)
      )
    } else {
      $replaceTarget.parentElement.removeChild($replaceTarget);
    }
  }

  toggleLoading(loading: boolean) {
    this.loading = loading;
    (loading) ?
    this.element.classList.add('loading')
    :
    this.element.classList.remove('loading');
  }

  requestRefresh(sections) {
    return fetch(`${location.pathname}?sections=${sections}`).then((res) => res.json());
  }

  async refresh() {
    this.toggleLoading(true);
    let [section, timeout] = await Promise.all([
        this.requestRefresh(this.idValue),
        sleep(600)
    ]);
    let newSection = section[this.idValue];

    let $section = this.element;
    let $wrapper = document.createElement('div');
    $wrapper.innerHTML = newSection;

    this.toggleLoading(false);
    if(this.replaceTargets.length) {
        this.replaceTargets.forEach(($replaceTarget: HTMLElement) => {
            this.replaceTarget($replaceTarget, $wrapper);
        })
    } else {
        $section.replaceWith($wrapper.querySelector(`#shopify-section-${this.idValue}`))
    }

    console.log('Refresh section', { id: this.idValue });
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */
  loading: boolean;

  /* -------------------------------------------- */
  /* Stimulus Values Type                         */
  /* -------------------------------------------- */
  idValue: string;

  /* -------------------------------------------- */
  /* Stimulus Values Targets                      */
  /* -------------------------------------------- */
  replaceTargets: HTMLElement[];
}
