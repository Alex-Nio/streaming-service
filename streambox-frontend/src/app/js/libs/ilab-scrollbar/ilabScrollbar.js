/* eslint-disable no-unused-vars */
import SimpleBar from 'simplebar';
import '../../../../../node_modules/simplebar/dist/simplebar.min.css';

export class ilabScrollbar {
  constructor(element, options) {
    this.$element = element;
    this.options = options;

    this.#setup();
  }

  #setup() {
    const scrollbarElement = new SimpleBar(this.$element, this.options);
    this.$element.classList.add('custom-scrollbar');
  }

  reinit() {
    this.#setup();
  }
}
