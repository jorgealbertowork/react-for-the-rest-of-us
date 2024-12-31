import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Components
import Page from './Page';
import LoadingDotsIcon from './LoadingDotsIcon';

export const ViewSinglePost = (props) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: cancelRequest.token
        });
        if (response.data) {
          setPost(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log('There was a problem, or the request was cancelled.');
      }
    }
    fetchPost();
    return () => {
      cancelRequest.cancel();
    };
  }, []);

  if (isLoading)
    return (
      <Page title='...'>
        <LoadingDotsIcon />
      </Page>
    );

  const rawDate = new Date(post.createdDate);
  const date = `${rawDate.getFullYear()}/${
    rawDate.getMonth() + 1
  }/${rawDate.getDate()}`;

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        <span className='pt-2'>
          <a
            href='#'
            className='text-primary mr-2'
            title='Edit'
          >
            <i className='fas fa-edit'></i>
          </a>
          <a
            className='delete-post-button text-danger'
            title='Delete'
          >
            <i className='fas fa-trash'></i>
          </a>
        </span>
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img
            className='avatar-tiny'
            src={post.author.avatar}
          />
        </Link>
        Posted by{' '}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{' '}
        on {date}
      </p>

      <div className='body-content'>
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
