import React, { useEffect, useContext } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Contexts
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

// Components
import { Link } from 'react-router-dom';

export const HeaderLoggedIn = (props) => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
  }

  function handleSearch(e) {
    e.preventDefault();
    appDispatch({ type: 'openSearch' });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        href="#"
        className="text-white mr-2 header-search-icon"
        onClick={handleSearch}
        data-tooltip-content="Search"
        data-tooltip-id="search"
      >
        <i className="fas fa-search" />
      </a>
      <ReactTooltip id="search" className="custom-tooltip" />{' '}
      <span
        className="mr-2 header-chat-icon text-white"
        data-tooltip-content="Chat"
        data-tooltip-id="chat"
      >
        <i className="fas fa-comment" />
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip id="chat" className="custom-tooltip" />{' '}
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-tooltip-content="Profile"
        data-tooltip-id="profile"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip id="profile" className="custom-tooltip" />{' '}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{' '}
      <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
