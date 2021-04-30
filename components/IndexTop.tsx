import Image from "next/image"
import { Themed } from "theme-ui"
import { Top } from "@/components/PageSection"
import { src as meImage } from "@/public/img/me.jpg"
import { yourName } from "@/helpers/globals"

export const IndexTop: React.FC<{ visibleTitle: string }> = ({
  visibleTitle,
}) => (
  <Top sx={{ position: "relative" }}>
    <Themed.h1>
      {visibleTitle}
      <div
        sx={{
          display: "inline",
          "@media (max-width: 39ch)": {
            display: "none",
          },
          "> div": {
            width: "1.6em !important",
            height: "1.6em !important",
            borderRadius: "50%",
          },
          img: { fontSize: 1 },
          position: "absolute",
          marginLeft: "0.4em",
          bottom: "-0.4em",
        }}
      >
        <Image
          src={meImage}
          layout="fixed"
          width={70}
          height={70}
          alt={`Closeup of ${yourName}, smiling`}
          priority
        />
      </div>
    </Themed.h1>
  </Top>
)
