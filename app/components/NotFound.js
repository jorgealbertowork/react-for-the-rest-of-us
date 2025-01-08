import React from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';

export const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Sorry, we could not find that page.</h2>
        <p className="lead text-muted">
          But you can always visit the <Link to="/">homepage</Link> to get a
          fresh start.
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
