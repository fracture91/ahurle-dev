import { browserKbFocusStyles, theme } from "@/helpers/theme"
import { WrapFC } from "@/helpers/WrapFC"
import { Button } from "theme-ui"
import { DownCaret } from "./DownCaret"

export const ShowMoreButton: WrapFC<
  typeof Button,
  {
    moreVisibleSelector: string
    focusBasisSelector?: string
    htmlFor?: string
  }
> = ({
  moreVisibleSelector,
  focusBasisSelector,
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
      ...(focusBasisSelector
        ? {
            [`${focusBasisSelector}:focus ~ &, ${focusBasisSelector}:hover ~ &`]: {
              ...theme.buttons.primary["&:hover, &:focus"],
            },
            [`${focusBasisSelector}:focus-visible ~ &`]: browserKbFocusStyles,
          }
        : {}),
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

const selectCheckbox = "input[type='checkbox']"
const whenChecked = `${selectCheckbox}:checked ~ &`

// https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/#hiding-the-checkboxes-inclusively
// a hidden checkbox is positioned on top of the ShowMoreButton for a11y
export const ShowMore: React.FC<{ id: string }> = ({ id, children }) => (
  <div sx={{ my: "1em", position: "relative" }}>
    <input
      id={id}
      type="checkbox"
      sx={{
        position: "absolute",
        bottom: "-5px",
        left: "-5px",
        right: "-5px",
        display: "block",
        width: "100%",
        height: "2.6em",
        opacity: 0,
        zIndex: 1,
        cursor: theme.buttons.primary.cursor,
      }}
    />
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
      focusBasisSelector={selectCheckbox}
      as="label"
      htmlFor={id}
      data-goatcounter-click={id}
      data-goatcounter-title={id}
    />
  </div>
)

export const HideInitially: WrapFC<"div"> = ({ children, ...props }) => (
  <div
    {...props}
    sx={{
      display: "none",
      [whenChecked.replace("&", "div > &")]: { display: "unset" },
    }}
  >
    {/* hidden p tag because some elements have a :first-child rule that disables top margin */}
    <p hidden />
    {children}
  </div>
)
