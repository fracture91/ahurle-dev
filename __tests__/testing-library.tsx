import React from "react"
import { render } from "@testing-library/react"
import Index from "../pages/index"

test("renders text", () => {
  const { getByText } = render(<Index introduction="" features="" posts={[]} />)
  const linkElement = getByText(/Introduction to Devii/)
  expect(linkElement).toBeInTheDocument()
})
