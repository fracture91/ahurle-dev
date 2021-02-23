import * as subject from "helpers/loader"

describe("loader", () => {
  describe("srcToFsPath", () => {
    ;[
      // normal cases
      ["/_next/static/images/pancake.jpg", ".next/static/images/pancake.jpg"],
      ["_next/static/images/pancake.jpg", ".next/static/images/pancake.jpg"],
      ["img/pancake.jpg", "public/img/pancake.jpg"],
      ["/img/pancake.jpg", "public/img/pancake.jpg"],
      ["public/img/pancake.jpg", "public/img/pancake.jpg"],
      ["/public/img/pancake.jpg", "public/img/pancake.jpg"],
      // weird cases
      ["publicasdf/whatever", "public/publicasdf/whatever"],
      ["_thing/whatever", "public/_thing/whatever"],
      ["/_nextasdf/whatever", "public/_nextasdf/whatever"],
    ].forEach(([input, expected]) => {
      it(`transforms ${input} to ${expected}`, () => {
        expect(subject.srcToFsPath(input)).toEqual(expected)
      })
    })
  })
})
