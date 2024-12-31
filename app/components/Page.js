import React, { useEffect } from 'react';
import Container from './Container';

export const Page = (props) => {
  useEffect(() => {
    document.title = `ComplexApp | ${props.title}`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container wide={props.wide}>{props.children}</Container>;
};

export default Page;
