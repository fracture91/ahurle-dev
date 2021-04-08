import { getPage } from "next-page-tester"
import { act, fireEvent, screen, waitFor } from "@testing-library/react"
import { initWindowGoatcounter, endpoint } from "@/components/GoatCounter"

describe("Homepage", () => {
  beforeAll(() => {
    // make sure initWindowGoatcounter is already called for us
    // eslint-disable-next-line jest/no-standalone-expect
    expect(window.goatcounter).toBeInstanceOf(Object)
  })

  beforeEach(() => {
    // need to clear out whatever state persists between tests
    initWindowGoatcounter(true)
  })

  afterAll(() => {
    // and make sure changes from the last test don't leak out to other files
    initWindowGoatcounter(true)
  })

  it("renders nicely", async () => {
    const { render } = await getPage({ route: "/", useDocument: true })
    render()
    expect(screen.getByText("ahurle.dev")).toBeVisible()
    expect(screen.getByText("Hi, I'm Andrew Hurle")).toBeVisible()
  })

  const renderAndAct = async (url?: string) => {
    const route = url || "/"
    // next-page-tester doesn't set window.location for us
    window.location.href = `${window.location.origin}${route}`
    const page = await getPage({ route, useDocument: true })
    act(() => {
      page.render()
    })
    return page
  }

  it("sets up goatcounter stuff that looks correct", async () => {
    await renderAndAct()

    const script = document.querySelector("script[data-goatcounter]")
    expect(script).toMatchInlineSnapshot(`
      <script
        data-goatcounter="https://ahurle-dev.goatcounter.com/count"
        src="https://gc.zgo.at/count.js"
      />
    `)
    expect(window.goatcounter).toMatchInlineSnapshot(`
      Object {
        "bind_events": [Function],
        "count": [Function],
        "disabled": false,
        "filter": [Function],
        "no_events": true,
        "no_onload": true,
        "queue": Array [
          undefined,
        ],
      }
    `)
    // simulate the mutation that the script performs
    // eslint-disable-next-line no-multi-assign
    const count = (window.goatcounter.count = jest.fn())
    // eslint-disable-next-line no-multi-assign
    const filter = (window.goatcounter.filter = jest.fn())
    // eslint-disable-next-line no-multi-assign
    const bindEvents = (window.goatcounter.bind_events = jest.fn())

    fireEvent.load(script as Element)
    expect(window.goatcounter.filter).not.toEqual(filter) // should be mutated
    expect(count).toHaveBeenCalledWith(undefined)
    expect(bindEvents).toHaveBeenCalled()
    expect(window.goatcounter.queue).toHaveLength(0)

    expect(filter).not.toHaveBeenCalled()
    window.goatcounter.filter()
    expect(filter).toHaveBeenCalled() // should call original
  })

  it("handles gc script errors correctly", async () => {
    await renderAndAct()

    const countStub = window.goatcounter.count
    expect(window.goatcounter.queue).toHaveLength(1)
    const script = document.querySelector("script[data-goatcounter]")
    fireEvent.error(script as Element)
    expect(window.goatcounter.queue).toHaveLength(0)
    expect(window.goatcounter.count).not.toEqual(countStub)
  })

  it("calls count upon page navigation", async () => {
    // eslint-disable-next-line no-multi-assign
    const count = (window.goatcounter.count = jest.fn())
    await renderAndAct()
    expect(count).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByText("Links", { selector: "[href='/links']" }))
    await waitFor(() => expect(count).toHaveBeenCalledTimes(2))
  })

  it("server renders a pixel inside a noscript", async () => {
    const { serverRenderToString } = await getPage({
      route: "/?utm_source=test",
      useDocument: true,
    })
    // can't seem to see things inside <noscript> with serverRender()
    const { html } = serverRenderToString()
    const regex = new RegExp(
      `<noscript><img src="${endpoint}[^>]*\\/><\\/noscript>`
    )
    expect(html.match(regex)?.[0]).toMatchInlineSnapshot(
      '"<noscript><img src=\\"https://ahurle-dev.goatcounter.com/count?p=%2Findex&amp;q=utm_source%3Dtest&amp;r=gcpixel\\" alt=\\"\\"/></noscript>"'
    )
  })
  ;(["load", "error"] as const).forEach((action) => {
    it("removes utm params from URL once script loads", async () => {
      await renderAndAct("/?utm_source=test&hello=1&ref=test#anchor")
      const script = document.querySelector("script[data-goatcounter]")
      fireEvent[action](script as Element)

      await waitFor(() =>
        expect(window.location.href).toEqual(
          "https://localhost/?hello=1#anchor"
        )
      )
    })
  })

  // unfortunately I'm not sure if these tests can actually reproduce the problem
  it("only counts one pageview when query params are given and script not loaded yet", async () => {
    await renderAndAct("/?utm_source=test")
    expect(window.goatcounter.queue).toEqual([undefined])
  })

  it("only counts one pageview when query params are given and script has loaded", async () => {
    // eslint-disable-next-line no-multi-assign
    const count = (window.goatcounter.count = jest.fn()) // simulate mutation that the script performs
    await renderAndAct("/?utm_source=test")
    const script = document.querySelector("script[data-goatcounter]")
    fireEvent.load(script as Element)

    expect(window.goatcounter.queue).toEqual([])
    expect(count).toHaveBeenCalledTimes(1)
  })
})
