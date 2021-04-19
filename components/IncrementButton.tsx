import { WrapFC } from "@/helpers/WrapFC"
import { useState } from "react"
import { Button } from "theme-ui"

export const IncrementButton: WrapFC<
  typeof Button,
  { startingNumber: number }
> = ({ startingNumber, ...props }) => {
  const [number, setNumber] = useState(startingNumber)
  return (
    <Button
      {...props}
      {...(number >= 80 && { bg: "red !important" })}
      onClick={() => {
        setNumber((prev) => prev + 1)
        if (number === startingNumber)
          window.goatcounter.count({
            event: true,
            path: "clicked-increment-button",
          })
      }}
      sx={{ width: "100%" }}
    >
      You have clicked {number} time{number === 1 ? "" : "s"}.
      {number >= 10 && " Wow!"}
      {number >= 40 && " You're so good at clicking! 🎉"}
      {number >= 80 && <p>ERROR: TOO MANY CLICKS</p>}
    </Button>
  )
}
