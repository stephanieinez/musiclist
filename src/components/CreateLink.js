import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { FEED_QUERY } from './TrackList';

const FlexContainer = styled.div`
  display: flex;
`;

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
  margin-left: 0.25em;
  margin-right: 1em;
  border-bottom: 2px solid black;
  border-top: none;
  border-left: none;
  border-right: none;
`;

const Label = styled.label`
  font-size: 0.75em;
  margin: 0.25em;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const withCreate = graphql(POST_MUTATION, {
  props: ({ mutate }) => ({
    createLink: (description, url, genre) =>
      mutate({ variables: { description, url, genre } }),
  }),
  options: {
    update: (proxy, { data: { post } }) => {
      const cacheResult = proxy.readQuery({ query: FEED_QUERY });
      proxy.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            ...cacheResult.feed,
            links: [...cacheResult.feed.links.reverse(), post],
          },
        },
      });
    },
  },
});

const RenderInput = ({ label, value, onChange }) => (
  <InputWrapper>
    <Label>{label}</Label>
    <Input value={value} onChange={onChange} type="text" />
  </InputWrapper>
);

const CreateLink = ({ createLink }) => {
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [genre, setGenre] = useState('');

  return (
    <FlexContainer>
      <RenderInput
        label="Artist and track name"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <RenderInput
        label="Link"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <RenderInput
        label="Genre"
        value={genre}
        onChange={e => setGenre(e.target.value.toLowerCase())}
      />
      <Button
        disabled={description.length && url.length ? false : true}
        onClick={() => {
          createLink(description, url, genre);
          setDescription('');
          setUrl('');
          setGenre('');
        }}
      >
        Submit
      </Button>
    </FlexContainer>
  );
};

export default withCreate(CreateLink);
