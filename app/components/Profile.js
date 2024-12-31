import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import StateContext from '../StateContext';

import Page from './Page';
import ProfilePosts from './ProfilePosts';

export const Profile = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: {
      postCount: '',
      followerCount: '',
      followingCount: ''
    }
  });

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token
          },
          {
            cancelToken: cancelRequest.token
          }
        );
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (e) {
        console.log('There was an error.');
      }
    }
    fetchData();
    return () => {
      cancelRequest.cancel();
    };
  }, []);

  return (
    <Page title='Profile screen'>
      <h2>
        <img
          className='avatar-small'
          src={profileData.profileAvatar}
        />
        {profileData.profileUsername}
        <button className='btn btn-primary btn-sm ml-2'>
          Follow <i className='fas fa-user-plus'></i>
        </button>
      </h2>

      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <a
          href='#'
          className='active nav-item nav-link'
        >
          Posts: {profileData.counts.postCount}
        </a>
        <a
          href='#'
          className='nav-item nav-link'
        >
          Followers: {profileData.counts.followerCount}
        </a>
        <a
          href='#'
          className='nav-item nav-link'
        >
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  );
};

export default Profile;
