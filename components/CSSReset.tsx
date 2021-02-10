/** @jsxImportSource theme-ui */
import { Global, css } from "@emotion/react"
import { theme } from "helpers/theme"

// based on https://github.com/hankchizljaw/modern-css-reset with some tweaks

export const CSSReset = (
  <Global
    styles={css`
      html,
      body,
      #__next {
        min-height: 100%;
        padding: 0;
        margin: 0;
      }

      @media (min-width: 0px) {
        html {
          font-size: 89.4735%;
        }
      }

      @media (min-width: ${theme.breakpoints[0]}) {
        html {
          font-size: 100%;
        }
      }

      @media (min-width: ${theme.breakpoints[2]}) {
        html {
          font-size: 110%;
        }
      }

      @media (min-width: ${theme.breakpoints[3]}) {
        html {
          font-size: 130%;
        }
      }

      /* Box sizing rules */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      /* Remove default margin */
      body,
      h1,
      h2,
      h3,
      h4,
      p,
      figure,
      blockquote,
      dl,
      dd {
        margin: 0;
      }

      /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
      ul[role="list"],
      ol[role="list"] {
        list-style: none;
      }

      /* Set core root defaults */
      html:focus-within {
        scroll-behavior: smooth;
      }

      /* Set core body defaults */
      body {
        text-rendering: optimizeLegibility;
        line-height: 1.6;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      /* A elements that don't have a class get default styles */
      a:not([class]) {
        text-decoration-skip-ink: auto;
      }

      /* Make images easier to work with */
      img,
      picture {
        max-width: 100%;
        display: block;
      }

      /* Inherit fonts for inputs and buttons */
      input,
      button,
      textarea,
      select {
        font: inherit;
      }

      /* Remove all animations and transitions for people that prefer not to see them */
      @media (prefers-reduced-motion: reduce) {
        html:focus-within {
          scroll-behavior: auto;
        }
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}
  />
)