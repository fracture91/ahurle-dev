import React from "react"
import { format } from "fecha"
import { PostData } from "helpers/loader"

export const AuthorLines: React.FC<{ post: PostData }> = ({ post }) => (
  <div>
    <p className="author-line">
      {post.author?.name && <span>{post.author?.name}</span>}

      {post.author?.twitter && (
        <span>
          {" "}
          <a
            href={`https://twitter.com/${post.author?.twitter}`}
          >{`@${post.author?.twitter}`}</a>{" "}
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
      {post.author?.photo && (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={post.author?.photo?.url}
          alt={post.author?.photo?.alt}
          className="author-image"
        />
      )}
      <AuthorLines post={post} />
    </div>
  </div>
)
