import { defineConfig } from '@syncify/cli';
import autoprefix from 'autoprefixer';

export default defineConfig({
  clean: false,
  input: 'src',
  output: 'theme',
  config: '.',
  import: 'import',
  export: 'export',
  stores: {
    domain: 'uniun-sandbox',
    themes: {
      dev: 143847784743
    }
  },
  paths: {
    assets: [
      'assets/images/*',
      'assets/fonts/*'
    ],
    customers: 'views/customer/*',
    config: 'data/settings/*',
    layout: 'views/*.liquid',
    locales: 'data/translations/*',
    metafields: 'data/metafields/**/*',
    pages: 'views/pages/*',
    sections: [
      'views/sections/**/*'
    ],
    snippets: 'views/snippets/*',
    templates: 'views/templates/**/*'
  },
  transforms: {
    script: {
      'assets/bundle.min.js': 'assets/scripts/bundle.ts'
    },
    svg: {
      'snippets/icons.liquid': {
        input: 'assets/icons/sprite/*.svg',
        format: 'sprite'
      },
      'snippets/check.icon.liquid': {
        format: 'file',
        input: 'assets/pictograms/man.svg',
        snippet: true
      }
    },
    style: {
      'assets/stylesheet.min.css': {
        input: 'assets/styles/stylesheet.scss',
        sass: true,
        watch: [ 'assets/styles/base/*' ]
      }
    }
  },
  views: {
    sections: {
      prefixDir: true,
      separator: '-',
      global: []
    },
    pages: {
      language: 'markdown',
      suffixDir: false
    }
  },
  processors: {
    esbuild: {
      format: 'esm',
      bundle: true,
      sourcemap: true
    },
    sprite: {
      svg: {
        dimensionAttributes: true,
        namespaceIDs: true,
        rootAttributes: {
          class: 'd-none'
        }
      }
    },
    sass: {
      sourcemap: true,
      style: 'compressed',
      include: [ 'node_modules' ]
    },
    postcss: [
      autoprefix()
    ]
  }
});
