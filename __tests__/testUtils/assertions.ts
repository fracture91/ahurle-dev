export const expectStatusCode = (code: string | number): void =>
  expect(document.querySelector('meta[http-equiv="status"]')).toHaveAttribute(
    "content",
    code.toString()
  )
