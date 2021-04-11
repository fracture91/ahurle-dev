import { WrapFC } from "@/helpers/WrapFC"
import { Button } from "theme-ui"
import { DownCaret } from "./DownCaret"

export const ShowMoreButton: WrapFC<
  typeof Button,
  {
    moreVisibleSelector: string
    htmlFor?: string
  }
> = ({
  moreVisibleSelector,
  children = (
    <>
      Show <span>More</span>
      <span sx={{ display: "none" }}>Less</span>
    </>
  ),
  ...buttonProps
}) => (
  <Button
    {...buttonProps}
    sx={{
      mt: "1em",
      display: "block",
      textAlign: "center",
      [moreVisibleSelector]: {
        span: { display: "none" },
        "span + span": { display: "inline" },
        svg: { transform: "rotate(-180deg)" },
      },
    }}
  >
    {children}
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
)

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
    <ShowMoreButton
      moreVisibleSelector={whenChecked}
      as="label"
      htmlFor={id}
      data-goatcounter-click={id}
      data-goatcounter-title={id}
    />
  </div>
)
