import { Controller } from '@hotwired/stimulus';
import * as vp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Header extends Controller {

  /**
   * Stimulus Values
   */
  static values = {};

  /**
   * Stimulus Targets
   */
  static targets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {

    console.log('Header Initialize');

  }

  /**
   * Stimulus Connect
   */
  public connect () {}

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}

  /**
   * This is called from the DOM on the `data-action="resize@window->carousel#screen"`
   * attribute.
   */
  public screen () {
    console.log('Header Screen');
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * Stimulus: Whether or not viewer is enabled/disabled
   */
  active: boolean;
}
