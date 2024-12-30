import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from './Page';
import axios from 'axios';

import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

export const CreatePost = (props) => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/create-post', {
        title,
        body,
        token: appState.user.token
      });
      appDispatch({
        type: 'flashMessage',
        value: 'Your post was successfully created.'
      });
      navigate(`/post/${response.data}`);
    } catch (e) {
      console.log('There was a problem');
    }
  }

  return (
    <Page title='Create new post'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label
            htmlFor='post-title'
            className='text-muted mb-1'
          >
            <small>Title</small>
          </label>
          <input
            autoComplete='off'
            autoFocus
            className='form-control form-control-lg form-control-title'
            id='post-title'
            name='title'
            onChange={(e) => setTitle(e.target.value)}
            placeholder=''
            type='text'
          />
        </div>

        <div className='form-group'>
          <label
            htmlFor='post-body'
            className='text-muted mb-1 d-block'
          >
            <small>Body Content</small>
          </label>
          <textarea
            className='body-content tall-textarea form-control'
            id='post-body'
            name='body'
            onChange={(e) => setBody(e.target.value)}
            type='text'
          ></textarea>
        </div>

        <button className='btn btn-primary'>Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;
