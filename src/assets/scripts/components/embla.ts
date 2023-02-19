import EmblaCarousel, { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = {}

const emblaNode = <HTMLElement>document.querySelector('.embla')
const viewportNode = <HTMLElement>emblaNode.querySelector('.embla__viewport')

console.log('Embla!');