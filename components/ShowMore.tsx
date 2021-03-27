/** @jsxImportSource theme-ui */
import { Button } from "theme-ui"

const whenChecked = "input[type='checkbox']:checked ~ &"

export const ShowMore: React.FC<{ id: string }> = ({ id, children }) => (
  <div sx={{ my: "1em" }}>
    <input id={id} type="checkbox" sx={{ display: "none" }} />
    <div
      sx={{
        order: 1,
        maxHeight: "max(min(40em, 70vh), 20em)",
        overflowY: "hidden",
        [whenChecked]: { maxHeight: "none" },
      }}
    >
      {children}
    </div>
    {/* eslint jsx-a11y/label-has-associated-control: ["error", { assert: "either" } ] */}
    <Button
      as="label"
      // @ts-ignore: missing from type for some reason
      htmlFor={id}
      sx={{
        mt: "1em",
        display: "block",
        textAlign: "center",
        "::after": { content: "' More ⮟'" },
        [whenChecked]: { "::after": { content: "' Less ⮝'" } },
      }}
    >
      Show
    </Button>
  </div>
)
