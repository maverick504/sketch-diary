export function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  let position = {}

  if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    position = { x: 0, y: 0 }
  } else if (from.meta.group !== undefined && to.meta.group !== undefined && from.meta.group === to.meta.group) {
    position = {}
  } else {
    position = { x: 0, y: 0 }
  }

  if (to.hash) {
    position = { selector: to.hash }
  }

  return position
}
