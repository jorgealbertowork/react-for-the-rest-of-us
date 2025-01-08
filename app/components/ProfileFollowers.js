import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Contexts
import StateContext from '../StateContext';
import LoadingDotsIcon from './LoadingDotsIcon';

export const ProfileFollowers = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const appState = useContext(StateContext);

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/followers`, {
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
      {posts.map((follower, index) => {
        return (
          <Link
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
            key={index}
          >
            <img className="avatar-tiny" src={follower.avatar} />
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowers;
