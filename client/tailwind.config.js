const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  important: false,
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    borderRadius: {
      'none': '0',
      'sm': '.125rem',
      'default': '.25rem',
      'lg': '.5rem',
      'xl': '1rem',
      'full': '9999px'
    },
    colors: {
      'transparent': colors.transparent,
      'white': colors.white,
      'black': colors.black,
      'transparent-black': '#0006',
      'gray': colors.gray,
      'primary': {
        'lighter': colors.blue['300'],
        'default': colors.blue['400'],
        'darker': colors.blue['500'],
        '100': colors.blue['100'],
        '200': colors.blue['200'],
        '300': colors.blue['300'],
        '400': colors.blue['400'],
        '500': colors.blue['500'],
        '600': colors.blue['600'],
        '700': colors.blue['700'],
        '800': colors.blue['800'],
        '900': colors.blue['900']
      },
      'red': {
        'lighter': colors.red['300'],
        'default': colors.red['400'],
        'darker': colors.red['500'],
        '100': colors.red['100'],
        '200': colors.red['200'],
        '300': colors.red['300'],
        '400': colors.red['400'],
        '500': colors.red['500'],
        '600': colors.red['600'],
        '700': colors.red['700'],
        '800': colors.red['800'],
        '900': colors.red['900']
      },
      'green': {
        'lighter': colors.green['300'],
        'default': colors.green['400'],
        'darker': colors.green['500'],
        '100': colors.green['100'],
        '200': colors.green['200'],
        '300': colors.green['300'],
        '400': colors.green['400'],
        '500': colors.green['500'],
        '600': colors.green['600'],
        '700': colors.green['700'],
        '800': colors.green['800'],
        '900': colors.green['900']
      },
      'blue': {
        'lighter': colors.blue['300'],
        'default': colors.blue['400'],
        'darker': colors.blue['500'],
        '100': colors.blue['100'],
        '200': colors.blue['200'],
        '300': colors.blue['300'],
        '400': colors.blue['400'],
        '500': colors.blue['500'],
        '600': colors.blue['600'],
        '700': colors.blue['700'],
        '800': colors.blue['800'],
        '900': colors.blue['900']
      },
      'yellow': {
        'lighter': colors.yellow['300'],
        'default': colors.yellow['400'],
        'darker': colors.yellow['500'],
        '100': colors.yellow['100'],
        '200': colors.yellow['200'],
        '300': colors.yellow['300'],
        '400': colors.yellow['400'],
        '500': colors.yellow['500'],
        '600': colors.yellow['600'],
        '700': colors.yellow['700'],
        '800': colors.yellow['800'],
        '900': colors.yellow['900']
      }
    },
    cursor: {
      'pointer': 'pointer',
      'help': 'help',
      'not-allowed': 'not-allowed'
    }
  },
  plugins: [
    require('tailwindcss-accessibility')
  ]
}
