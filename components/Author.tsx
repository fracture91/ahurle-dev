import React from "react"
import { format } from "fecha"
import { PostData } from "../helpers/loader"

export const AuthorLines: React.FC<{ post: PostData }> = ({ post }) => (
  <div>
    <p className="author-line">
      {post.author && <span>{post.author}</span>}

      {post.authorTwitter && (
        <span>
          {" "}
          <a
            href={`https://twitter.com/${post.authorTwitter}`}
          >{`@${post.authorTwitter}`}</a>{" "}
        </span>
      )}
    </p>
    <p className="author-line subtle">
      {post.datePublished
        ? format(new Date(post.datePublished), "MMMM Do, YYYY")
        : ""}
    </p>
  </div>
)

export const Author: React.FC<{ post: PostData }> = ({ post }) => (
  <div className="author-container">
    <div className="author">
      {post.authorPhoto && (
        <img
          src={post.authorPhoto}
          alt={post.authorPhotoAlt}
          className="author-image"
        />
      )}
      <AuthorLines post={post} />
    </div>
  </div>
)
