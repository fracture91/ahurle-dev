import { getPage } from "next-page-tester"
import { expectStatusCode } from "@/__tests__/testUtils/assertions"

describe("404 page", () => {
  it("has a 404 status code", async () => {
    const { render } = await getPage({ route: "/asdf1234", useDocument: true })
    render()
    expectStatusCode(404)
  })
})
