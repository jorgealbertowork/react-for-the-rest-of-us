import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';

// Contexts
import StateContext from '../StateContext';

// Components
import LoadingDotsIcon from './LoadingDotsIcon';
import Page from './Page';
import DispatchContext from '../DispatchContext';
import NotFound from './NotFound';

export const EditPost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const originalState = {
    title: { errorMessage: '', hasErrors: false, value: '' },
    body: { errorMessage: '', hasErrors: false, value: '' },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const editPostReducer = (draft, action) => {
    switch (action.type) {
      case 'bodyChange':
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case 'bodyRules':
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.errorMessage = 'Content field cannot be blank';
        }
        return;
      case 'fetchComplete':
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case 'notFound':
        draft.notFound = true;
        return;
      case 'saveRequestFinished':
        draft.isSaving = false;
        return;
      case 'saveRequestStarted':
        draft.isSaving = true;
        return;
      case 'submitRequest':
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case 'titleChange':
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.errorMessage = 'Title field cannot be blank';
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(editPostReducer, originalState);

  useEffect(() => {
    const cancelRequest = axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          cancelToken: cancelRequest.token,
        });
        if (response.data) {
          dispatch({ type: 'fetchComplete', value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: 'flashMessage',
              value: "You don't have permision to change this post. ",
            });
            navigate('/');
          }
        } else {
          dispatch({ type: 'notFound' });
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

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' });

      const cancelRequest = axios.CancelToken.source();

      async function fetchPost() {
        try {
          const response = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: cancelRequest.token,
            }
          );

          dispatch({ type: 'saveRequestFinished' });
          appDispatch({
            type: 'flashMessage',
            value: 'Post was updated.',
          });
        } catch (e) {
          console.log('There was a problem, or the request was cancelled.');
        }
      }
      fetchPost();
      return () => {
        cancelRequest.cancel();
      };
    }
  }, [state.sendCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'bodyRules',
      value: state.body.value,
    });
    dispatch({
      type: 'titleRules',
      value: state.title.value,
    });
    dispatch({ type: 'submitRequest' });
  };

  if (state.notFound) return <NotFound />;

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoComplete="off"
            autoFocus
            className="form-control form-control-lg form-control-title"
            id="post-title"
            name="title"
            placeholder=""
            type="text"
            value={state.title.value}
            onChange={(e) =>
              dispatch({
                type: 'titleChange',
                value: e.target.value,
              })
            }
            onBlur={(e) => {
              dispatch({
                type: 'titleRules',
                value: e.target.value,
              });
            }}
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.errorMessage}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            className="body-content tall-textarea form-control"
            id="post-body"
            name="body"
            type="text"
            value={state.body.value}
            onChange={(e) =>
              dispatch({
                type: 'bodyChange',
                value: e.target.value,
              })
            }
            onBlur={(e) => {
              dispatch({
                type: 'bodyRules',
                value: e.target.value,
              });
            }}
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.errorMessage}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
