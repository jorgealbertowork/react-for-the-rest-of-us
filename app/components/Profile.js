import React, { useContext, useEffect } from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';
import axios from 'axios';

// Contexts
import StateContext from '../StateContext';

// Components
import Page from './Page';
import ProfilePosts from './ProfilePosts';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing from './ProfileFollowing';

export const Profile = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: {
        postCount: '',
        followerCount: '',
        followingCount: '',
      },
    },
  });

  useEffect(() => {
    const thisRequest = axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: thisRequest.token,
          }
        );
        if (response.data) {
          setState((draft) => {
            draft.profileData = response.data;
          });
        }
      } catch (e) {
        console.log('There was an error.');
      }
    }
    fetchData();
    return () => {
      thisRequest.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const thisRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: thisRequest.token,
            }
          );

          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log('There was an error.');
        }
      }
      fetchData();
      return () => {
        thisRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const thisRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: thisRequest.token,
            }
          );

          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log('There was an error.');
        }
      }
      fetchData();
      return () => {
        thisRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Page title="Profile screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}

        {appState.userIsLogged &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != '...' && (
            <button
              className="btn btn-primary btn-sm ml-2"
              onClick={startFollowing}
              disabled={state.followActionLoading}
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}

        {appState.userIsLogged &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != '...' && (
            <button
              className="btn btn-danger btn-sm ml-2"
              onClick={stopFollowing}
              disabled={state.followActionLoading}
            >
              Unfollow <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className=" nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className=" nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className=" nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
};

export default Profile;
