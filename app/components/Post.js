import React from 'react';
import { Link } from 'react-router-dom';

export const Post = (props) => {
  const post = props.post;
  const rawDate = new Date(post.createdDate);
  const date = `${rawDate.getFullYear()}/${
    rawDate.getMonth() + 1
  }/${rawDate.getDate()}`;

  return (
    <Link
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
      onClick={props.onClick}
    >
      <img className="avatar-tiny" src={post.author.avatar} />
      <strong>{post.title}</strong>{' '}
      <span className="text-muted small">
        {!props.hideAuthor && <>by {post.author.username}</>} on {date}
      </span>
    </Link>
  );
};

export default Post;
