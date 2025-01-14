import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Contexts
import StateContext from '../StateContext';
import LoadingDotsIcon from './LoadingDotsIcon';
import Post from './Post';

export const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const appState = useContext(StateContext);

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: cancelRequest.token,
        });

        if (response.data) {
          setPosts(response.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log('There was an error.');
      }
    }

    fetchPosts();

    return () => {
      cancelRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post post={post} key={post._id} hideAuthor={true} />;
      })}
    </div>
  );
};

export default ProfilePosts;
