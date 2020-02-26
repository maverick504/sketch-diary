const TInput = {
  baseClass: 'block w-full bg-gray-100 border focus:border-primary outline-none',
  errorStatusClass: 'border-danger'
}

const TTextarea = {
  baseClass: 'block w-full bg-gray-100 border focus:border-primary outline-none'
}

const TSelect = {
  baseClass: 'block w-full bg-gray-100 pr-8 border focus:border-primary outline-none appearance-none'
}

const TButton = {
  baseClass: 'button',
  defaultClass: 'button-default-variant',
  primaryClass: 'button-primary',
  secondaryClass: 'button-secondary',
  tertiaryClass: 'button-tertiary',
  successClass: 'button-success',
  dangerClass: 'button-danger',
  warningClass: 'button-warning',
  disabledClass: 'button-disabled',
  defaultSizeClass: 'button-default-size',
  largeSizeClass: 'button-large',
  smallSizeClass: 'button-small'
}

const TModal = {
  baseClass: 'z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed overflow-x-hidden',
  overlayClass: 'z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-75',
  containerClass: 'z-50 relative p-3 md:py-8 mx-auto max-w-full',
  closeIconClass: 'fill-current h-6 w-6 text-gray-900 absolute right-0 mt-4 mx-6',
  wrapperClass: 'bg-white shadow-lg flex flex-col overflow-hidden',
  headerClass: 'bg-gray-100 p-4 text-gray-900 text-xl',
  bodyClass: 'flex-grow bg-white p-4 text-gray-900',
  footerClass: 'bg-gray-100 p-4 text-gray-900'
}

const MyOwnTheme = {
  TInput,
  TTextarea,
  TSelect,
  TButton,
  TModal
}

export default MyOwnTheme
