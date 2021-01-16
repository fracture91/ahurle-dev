import React from 'react';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Note that PrismAsyncLight will create one chunk for every language.
// This is better than shipping every language together in one big chunk, but it would be even better if I could not
// bother compiling anything besides the ~dozen languages I care about.
// Not sure how to accomplish that without a lot of copypasta from react-syntax-highlighter.
import { Prism, PrismAsyncLight } from "react-syntax-highlighter";
const SyntaxHighlighter = typeof window === "undefined" ? Prism : PrismAsyncLight;

export default class Code extends React.PureComponent<{
  language: string;
  value?: string;
}> {
  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter
        language={(language === 'ts' ? 'typescript' : language) || 'typescript'}
        style={darcula}
      >
        {value}
      </SyntaxHighlighter>
    );
  }
}
