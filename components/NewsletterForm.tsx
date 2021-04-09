/** @jsxImportSource theme-ui */

import { WrapFC } from "@/helpers/WrapFC"
import { useCallback } from "react"
import { Button, SxProp, Themed, ThemeUICSSObject } from "theme-ui"
import { RSS } from "@/components/RSS"
import { tinyLetterUsername } from "@/helpers/globals"
import { theme } from "@/helpers/theme"

const EmailInput: WrapFC<"input"> = (props) => (
  <input
    type="email"
    aria-label="Email address"
    name="email"
    placeholder="you@example.com"
    required
    data-goatcounter-click="email-input"
    sx={{
      mx: "0.5em",
      mt: "1em",
      width: "100%",
      maxWidth: "22ch",
      minWidth: "10ch",
      py: "0.3em",
      px: "0.5em",
      bg: "higher",
      color: "text",
      border: "1px solid",
      borderColor: "lower",
      borderRadius: "4px",
    }}
    {...props}
  />
)

const url = `https://tinyletter.com/${tinyLetterUsername}`

const Form: WrapFC<"form", { noForms?: boolean }> = ({
  noForms,
  children,
  ...props
}) => {
  const target = "popupwindow"
  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (_event: React.FormEvent<HTMLFormElement>) => {
      window.open(url, target, "scrollbars=yes,width=800,height=600")
      window.goatcounter.count({
        path: (p) => `email-submit-${p}`,
        event: true,
      })
      return true
    },
    []
  )

  const sx: ThemeUICSSObject = {
    mx: "auto",
    textAlign: "center",
    bg: "background",
    p: "1em",
    borderRadius: "2px",
    transition: theme.styles.root.transition,
  }

  if (noForms) return <div sx={sx}>{children}</div>

  return (
    <form
      action={url}
      target={target}
      onSubmit={handleSubmit}
      method="post"
      {...props}
      sx={sx}
    >
      {children}
    </form>
  )
}

const RealForm: WrapFC<typeof Form, { noForms?: boolean } & SxProp> = ({
  children = "Want to hear about new articles right away?",
  sx,
  noForms, // RSS feeds don't like forms, so they can be toggled off
  ...props
}) => {
  const cta = <strong>Subscribe to my newsletter!</strong>
  return (
    <Form {...props} sx={sx} noForms={noForms}>
      <p>{children}</p>
      <p>
        {!noForms && cta}
        {noForms && (
          <Themed.a
            data-goatcounter-click="newsletter-link"
            href="/newsletter"
            target="_blank"
            rel="noopener noreferrer"
          >
            {cta}
          </Themed.a>
        )}
      </p>
      {!noForms && (
        <>
          <input type="hidden" value="1" name="embed" />
          <EmailInput />
          <Button type="submit" mt="1em" mx="0.5em">
            Subscribe
          </Button>
        </>
      )}
      <p sx={{ color: "text.subtle", fontSize: 1, mt: "1em" }}>
        Don&apos;t like emails? Try the{" "}
        <Themed.a
          data-goatcounter-click="rss-newsletter"
          href="/rss.xml"
          // hide the external link icon here
          sx={{ whiteSpace: "nowrap", "&&:after": { content: "none" } }}
          target="_blank"
          rel="noopener noreferrer"
        >
          RSS Feed
          <RSS height="0.9em" width="0.9em" sx={{ ml: "0.4em" }} />
        </Themed.a>
      </p>
    </Form>
  )
}

export const NewsletterForm: React.FC<{
  noForms?: boolean
}> = tinyLetterUsername ? RealForm : () => null
