import React, { useState } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import GenreList from './GenreList';

const Button = styled.button`
  font-family: 'Montserrat', sans-serif;
  color: blue;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid blue;
  border-radius: 3px;
  transition: background 0.5s;
  cursor: ${props => (props.disabled ? null : 'pointer')};

  &:hover {
    background: ${props => (props.disabled ? 'white' : 'blue')};
    color: ${props => (props.disabled ? 'blue' : 'white')};
  }
`;

const Input = styled.input`
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em 1em;
  border: 2px solid black;
  border-radius: 3px;
`;

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!, $genre: String!) {
    post(description: $description, url: $url, genre: $genre) {
      id
      url
      description
      genre
    }
  }
`;

const CreateLink = () => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [genre, setGenre] = useState('');

  return (
    <div>
      <GenreList />
      <Input
        value={description}
        onChange={e => setDescription(e.target.value)}
        type="text"
        placeholder="Artist and track name"
      />
      <Input
        value={url}
        onChange={e => setUrl(e.target.value)}
        type="text"
        placeholder="Link"
      />
      <Input
        value={genre}
        onChange={e => setGenre(e.target.value.toLowerCase())}
        type="text"
        placeholder="Genre"
      />
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url, genre }}
      >
        {postMutation => (
          <Button
            disabled={description.length > 0 && url.length > 0 ? false : true}
            onClick={postMutation}
          >
            Submit
          </Button>
        )}
      </Mutation>
    </div>
  );
};

export default CreateLink;
