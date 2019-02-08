import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import TrackLink from './TrackLink';
import GenreList from './GenreList';

const ListItem = styled.div`
  display: flex;
  flex-wrap: wrap
  margin: 1em 0.25em;
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: color 0.25s;

  &:hover {
    color: palevioletred;
  }
`;

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
        genre
      }
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation deleteMutation($id: ID!) {
    delete(id: $id) {
      id
    }
  }
`;

const FILTER_QUERY = gql`
  query FilterQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        genre
      }
    }
  }
`;

const WithFeed = graphql(FEED_QUERY, {
  props: ({ data: { loading, error, feed } = {} }) => {
    return {
      loading,
      error,
      feed,
    };
  },
});

const withDeleteLink = graphql(DELETE_MUTATION, {
  props: ({ mutate }) => ({
    deleteLink: id => mutate({ variables: { id } }),
  }),
});

const LinkList = ({ loading, error, feed, deleteLink, client }) => {
  const [filteredLinks, setLinks] = useState([]);

  const filterGenres = async filter => {
    const result = await client.query({
      query: FILTER_QUERY,
      variables: { filter },
    });

    setLinks(result.data.feed.links);
  };

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;
  return (
    <div>
      <GenreList feed={feed.links} onClick={filterGenres} />
      {filteredLinks.length
        ? filteredLinks.map(link => (
            <ListItem key={link.id}>
              <TrackLink link={link} />
              <Button onClick={() => deleteLink(link.id)}>X</Button>
            </ListItem>
          ))
        : feed.links.map(link => (
            <ListItem key={link.id}>
              <TrackLink link={link} />
              <Button onClick={() => deleteLink(link.id)}>X</Button>
            </ListItem>
          ))}
    </div>
  );
};

export default withApollo(
  compose(
    withDeleteLink,
    WithFeed
  )(LinkList)
);
