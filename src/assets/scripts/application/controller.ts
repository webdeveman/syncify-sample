import { Controller as BaseController, Application } from '@hotwired/stimulus';

export class Controller extends BaseController {

  /**
   * Stimulus Instance
   */
  static connect (controllers: { [name: string]: any }) {

    const stimulus = Application.start();

    for (const id in controllers) {
      stimulus.register(id.toLowerCase(), controllers[id]);
    }

  }

  /**
   * Get Controller
   *
   * Returns the controller instance and methods from Stimulus.
   * Optionally pass in an `id` parameter value, which would
   * be the DOM element `id=""` value.
   */
  controller (identifier: string, id?: string): any {

    return this.application.controllers.find(
      ({ context }) => id ? (
        context.identifier === identifier &&
        context.element.id === id
      ) : (
        context.identifier === identifier
      )
    );

  }

}
