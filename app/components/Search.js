import React, { useContext, useEffect } from 'react';
import DispatchContext from '../DispatchContext';
import { useImmer } from 'use-immer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StateContext from '../StateContext';
import Post from './Post';

export const Search = () => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    requestCount: 0,
    results: [],
    searchTerm: '',
    show: 'neither',
  });

  useEffect(() => {
    document.addEventListener('keyup', searchKeyPressHandler);
    return () => document.removeEventListener('keyup', searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = 'loading';
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = 'neither';
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const thisRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            '/search',
            { searchTerm: state.searchTerm },
            { cancelToken: thisRequest.token }
          );
          setState((draft) => {
            draft.results = response.data;
            draft.show = 'results';
          });
        } catch (e) {
          console.log('There was a problem, or the request was cancelled.');
        }
      }
      fetchResults();
    }
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.key == 'Escape') {
      appDispatch({ type: 'closeSearch' });
    }
  }

  function handleInput(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label className="search-overlay-icon" htmlFor="live-search-field">
            <i className="fas fa-search" />
          </label>
          <input
            autoComplete="off"
            autoFocus
            className="live-search-field"
            id="live-search-field"
            onChange={handleInput}
            placeholder="What are you interested in?"
            type="text"
          />
          <span
            className="close-live-search"
            onClick={() => appDispatch({ type: 'closeSearch' })}
          >
            <i className="fas fa-times-circle" />
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={`circle-loader ${
              state.show == 'loading' ? 'circle-loader--visible' : ''
            }`}
          ></div>
          <div
            className={`live-search-results ${
              state.show == 'results' ? 'live-search-results--visible' : ''
            }`}
          >
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{' '}
                  {state.results.length > 1 ? 'items' : 'item'} found)
                </div>
                {state.results.map((post) => {
                  return (
                    <Post
                      post={post}
                      key={post._id}
                      onClick={() => appDispatch({ type: 'closeSearch' })}
                    />
                  );
                })}
              </div>
            )}

            {!Boolean(state.results.length) && (
              <p className="alert alert-danger text-center sahdow-sm">
                Sorry, no results were found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
