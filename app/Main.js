import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

// Contexts
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';

// Components
import About from './components/About';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import FlashMessages from './components/FlashMessages';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import HomeGuest from './components/HomeGuest';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import Terms from './components/Terms';
import ViewSinglePost from './components/ViewSinglePost';
import Search from './components/Search';
import { CSSTransition } from 'react-transition-group';

Axios.defaults.baseURL = 'http://localhost:3001';

const App = () => {
  const initialState = {
    flashMessages: [],
    user: {
      avatar: localStorage.getItem('complexAppAvatar'),
      token: localStorage.getItem('complexAppToken'),
      username: localStorage.getItem('complexAppUsername'),
    },
    userIsLogged: Boolean(localStorage.getItem('complexAppToken')),
    isSearchOpen: false,
  };

  function complexAppReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.user = action.data;
        draft.userIsLogged = true;
        return;

      case 'logout':
        draft.userIsLogged = false;
        return;

      case 'flashMessage':
        draft.flashMessages.push(action.value);
        return;
      case 'openSearch':
        draft.isSearchOpen = true;
        return;
      case 'closeSearch':
        draft.isSearchOpen = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(complexAppReducer, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('complexAppAvatar', state.user.avatar);
      localStorage.setItem('complexAppToken', state.user.token);
      localStorage.setItem('complexAppUsername', state.user.username);
    } else {
      localStorage.removeItem('complexAppAvatar');
      localStorage.removeItem('complexAppToken');
      localStorage.removeItem('complexAppUsername');
    }
  }, [state.userIsLogged]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header userIsLogged={state.userIsLogged} />
          <Routes>
            <Route
              path="/"
              element={state.userIsLogged ? <Home /> : <HomeGuest />}
            />
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CSSTransition
            timeout={330}
            classNames="search-overlay"
            in={state.isSearchOpen}
            unmountOnExit
          >
            <Search />
          </CSSTransition>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
