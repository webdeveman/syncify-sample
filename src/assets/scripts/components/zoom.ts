import { Controller } from '@hotwired/stimulus';
import ImageZoom from '../modules/image-zoom';

import * as vp from 'qvp';

/* -------------------------------------------- */
/* CLASS                                        */
/* -------------------------------------------- */

export class Zoom extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    width: {
        type: Number,
        default: 0
    },
    height: Number,
    zoomWidth: Number,
    scale: Number,
    fillContainer: Number,
  };

  /**
   * Stimulus Targets
   */
  static targets = ['container', 'image', 'lens', 'zoomed'];

  /**
   * Stimulus Outlets
   */
  static outlets = [];

  /**
   * Stimulus Initialize
   */
  public initialize () {
    this.sourceImg = {
        element: null,
        width: 0,
        height: 0,
        naturalHeight: 0,
        naturalWidth: 0
    }

    this.zoomedImgOffset = {
        vertical: 0,
        horizontal: 0
    }

    this.zoomedImg = {
        element: null,
        width: 0,
        height: 0
    }

    this.zoomLens = {
        element: null,
        width: 0,
        height: 0
    }

    this.scaleX = null;
    this.scaleY = null;
    this.offset = {
      vertical: 0,
      horizontal: 10,
    }

    console.log('Zoom Initialize')
  }

  /**
   * Stimulus Connect
   */
  public connect () {
    this.zoomPosition = 'right';

    this.imageTargets.forEach(($target: HTMLImageElement) => {
      $target.addEventListener('mouseenter', () => {
        if(!this.imageZoomEnabled) return;
        this.zoom = new ImageZoom($target.parentElement, {
            fillContainer: true,
            offset: {vertical: 0, horizontal: 0},
            zoomContainer: this.zoomedTarget,
            zoomPosition: 'original', 
            deactivate: () => {
              this.zoom.kill();
            }
        })
      });
    })
  }

  public screen () {
    if(!this.imageZoomEnabled && this.zoom) {
      console.log('Kill Zoom:', this.zoom);
      this.zoom.kill(); // kill on small screens;
    }
  }

  get imageZoomEnabled() {
    return vp.test('md|lg|xl|xxl', '|'); // Enable on md+ 
  }

  /**
   * Stimulus Disconnect
   */
  public disconnect () {}



  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */
  // Stimulus Values
  fillContainerValue: Number;
  widthValue: Number;
  heightValue: Number;
  zoomWidthValue: Number;
  scaleValue: Number;

  // Targets
  declare readonly containerTarget: HTMLElement;
  declare readonly imageTargets: HTMLImageElement[];
  declare readonly zoomedTarget: HTMLElement;
  declare readonly lensTarget: HTMLElement;

  // Target
  hasImageTargets: boolean;
  hasZoomedTarget: boolean;

  // State values
  scaleX: Number;
  scaleY: Number;
  offset: Offset;
  sourceImg: SourceImage;
  zoomedImgOffset: ZoomedImgOffset;
  zoomedImg: ZoomedImageLens;
  zoomLens: ZoomedImageLens;
  zoomPosition: String;
  zoom: any;
}

interface Offset {
    vertical: Number,
    horizontal: Number,
}


interface SourceImage {
    element: HTMLImageElement | null;
    width: Number,
    height: Number,
    naturalWidth: Number,
    naturalHeight: Number
}

interface ZoomedImgOffset {
    vertical: number,
    horizontal: number,
}

interface ZoomedImageLens {
    element: HTMLElement | null;
    width: 0;
    height: 0;
}