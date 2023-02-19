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
    domain: 'emanwebdev',
    themes: {
      dev: 139624349983
    }
  },
  hot: {
    label: 'visible',
    method: 'hot',
    inject: true,
    scroll: 'preserved',
    server: 3000,
    socket: 8089,
    layouts: [
      'theme.liquid'
    ],
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
      'assets/bundle.min.js': 'assets/scripts/bundle.ts',
      'assets/[dir]-[file].js': 'assets/scripts/components/*'
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
        watch: [ 'assets/styles/base/*' ],
        postcss: true,
        sass: true
      },
      'assets/tailwind.css': {
        input: 'assets/styles/tailwind.css',
        sass: false,
        postcss: true
      },
    }
  },
  views: {
    sections: {
      prefixDir: true,
      separator: '-',
      global: [
        'header'
      ]
    },
    pages: {
      language: 'markdown',
      suffixDir: false
    }
  },
  spawn: {
    watch: {
      tailwind: 'npx tailwindcss -i ./src/assets/styles/base.css -o ./src/assets/styles/tailwind.css --watch',
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
