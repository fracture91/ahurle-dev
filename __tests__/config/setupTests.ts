// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"
import failOnConsole from "jest-fail-on-console"
import MockDate from "mockdate"

failOnConsole()

global.afterEach(() => {
  // don't leak time changes between tests
  MockDate.reset()
})

const oldLocation = window.location
global.beforeEach(() => {
  // This is an approximation of how window.location would actually behave in the browser.
  // It is surely incomplete but works for my purposes.
  // Note that you likely need to set window.location.href to something in your test since
  // next-page-tester won't do that for you when you use getPage()
  const location = (new URL(
    window.location.href
  ) as unknown) as typeof window.location
  location.assign = jest.fn((href) => {
    location.href = href
  })
  location.replace = jest.fn((href) => {
    location.href = href
  })
  location.reload = jest.fn()
  // @ts-ignore: normally I would agree this is bad, but...
  delete window.location
  window.location = location

  window.history.replaceState = jest.fn((_stateObj, _title, url) => {
    if (url) location.href = `${location.origin}${url}`
  })
})

global.afterEach(() => {
  window.location = oldLocation
})
