/** @jsxImportSource theme-ui */
import { Button } from "theme-ui"
import { DownCaret } from "./DownCaret"

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
        [whenChecked]: {
          span: { display: "none" },
          "span + span": { display: "inline" },
          svg: { transform: "rotate(-180deg)" },
        },
      }}
    >
      Show <span>More</span>
      <span sx={{ display: "none" }}>Less</span>
      <DownCaret
        sx={{
          ml: "0.5em",
          verticalAlign: "middle",
          width: "1em",
          height: "1em",
          display: "inline",
          transition: "transform 200ms ease",
        }}
      />
    </Button>
  </div>
)
