import React from 'react';
import styled from 'styled-components';

const Genre = styled.button`
  padding: 0;
  margin: 0 0.25em;
  text-transform: uppercase;
  background: palevioletred;
  color: white;
  font-size: 0.75em;
  border: 0;
  cursor: pointer;
`;

const GenreList = props => {
  const reducedGenres =
    props.feed !== undefined
      ? props.feed.reduce((acc, item) => {
          if (!acc.includes(item.genre)) {
            return [...acc, item.genre];
          }
          return acc;
        }, [])
      : [];

  return (
    <div>
      {reducedGenres.map((item, index) => (
        <Genre key={index} onClick={() => props.onClick(item)}>
          {item}
        </Genre>
      ))}
    </div>
  );
};

export default GenreList;
