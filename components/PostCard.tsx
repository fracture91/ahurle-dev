/** @jsxImportSource theme-ui */
import React from "react"
import Link from "next/link"
import { format } from "fecha"
import { PostData } from "helpers/loader"
import { Tag } from "./Tag"

export const PostCard: React.FC<{ post: PostData }> = ({ post }) => (
  <Link href={`/${post.path}`}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className="post-card">
      <div className="post-card-inner">
        {post.bannerPhoto?.thumbnailUrl && (
          <div
            className="post-card-thumbnail"
            style={{ backgroundImage: `url(${post.bannerPhoto?.thumbnailUrl})` }}
          />
        )}
        <div className="post-card-title">
          {post.title && <h2>{post.title}</h2>}
          {post.subtitle && <p>{post.subtitle}</p>}
          <p>
            {post.datePublished
              ? format(new Date(post.datePublished), "MMMM Do, YYYY")
              : ""}
          </p>
          <div sx={{ flex: 1 }} />
          {false && (
            <div className="tag-container">
              {post.tags && (post.tags || []).map((tag) => <Tag tag={tag} />)}
            </div>
          )}
        </div>
      </div>
    </a>
  </Link>
)
