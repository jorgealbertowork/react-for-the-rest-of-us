import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Contexts
import StateContext from '../StateContext';

export const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const appState = useContext(StateContext);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`);
        if (response.data) {
          setPosts(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log('There was an error.');
      }
    }
    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='list-group'>
      {posts.map((post, index) => {
        const rawDate = new Date(post.createdDate);
        const date = `${rawDate.getFullYear()}/${
          rawDate.getMonth() + 1
        }/${rawDate.getDate()}`;

        return (
          <Link
            to={`/post/${post._id}`}
            className='list-group-item list-group-item-action'
            key={index}
          >
            <img
              className='avatar-tiny'
              src={appState.user.avatar}
            />
            <strong>{post.title}</strong>{' '}
            <span className='text-muted small'>on {date} </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;