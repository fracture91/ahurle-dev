import React from "react"

export const Tag: React.FC<{ tag: string }> = ({ tag }) => (
  <div className="tag">{tag}</div>
)
