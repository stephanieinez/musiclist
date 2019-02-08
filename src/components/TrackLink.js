import React from 'react';
import styled from 'styled-components';

const Link = styled.a`
  color: black;
  text-decoration: none;
  transition: color 0.25s;

  &:hover {
    color: blue;
  }
`;

const Genre = styled.span`
  padding: 0;
  margin: 0 0.5em;
  text-transform: uppercase;
  background: palevioletred;
  color: white;
  font-size: 0.5em;
`;

const LinkWrapper = styled.div`
display: flex
align-items: center
`;

const TrackLink = props => {
  return (
    <LinkWrapper>
      <Link href={`${props.link.url}`}>{props.link.description}</Link>
      <Genre>{props.link.genre}</Genre>
    </LinkWrapper>
  );
};

export default TrackLink;
