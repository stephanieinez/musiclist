import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import TrackLink from './TrackLink';
import GenreList from './GenreList';

const ListItem = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;
  margin: 1em 0.25em;
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 700;
  transition: color 0.25s;

  &:hover {
    color: palevioletred;
  }
`;

const Thumbnail = styled.img`
  height: 4em;
  width: 5em;
  margin-right: 0.5em;
`;

export const FEED_QUERY = gql`
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

const withFeed = graphql(FEED_QUERY, {
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
  options: {
    update: (proxy, { data: id }) => {
      const cacheResult = proxy.readQuery({ query: FEED_QUERY });
      proxy.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            ...cacheResult.feed,
            links: cacheResult.feed.links
              .reverse()
              .filter(e => e.id !== id.delete.id),
          },
        },
      });
    },
  },
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

  const extractVideoId = url => {
    if (url.includes('youtube')) {
      let videoId = url.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }

    if (!url.includes('youtube')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/8/82/Blue_Square.svg';
    }
  };

  const showAll = () => {
    setLinks([]);
  };

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <GenreList feed={feed.links} onClick={filterGenres} showAll={showAll} />
      {filteredLinks.length
        ? filteredLinks.map(link => (
            <ListItem key={link.id}>
              <Thumbnail
                src={extractVideoId(link.url)}
                alt={link.description}
              />
              <TrackLink link={link} />
              <Button onClick={() => deleteLink(link.id)}>X</Button>
            </ListItem>
          ))
        : feed.links.reverse().map(link => (
            <ListItem key={link.id}>
              <Thumbnail
                src={extractVideoId(link.url)}
                alt={link.description}
              />
              <TrackLink link={link} />
              <Button onClick={() => deleteLink(link.id)}>&times;</Button>
            </ListItem>
          ))}
    </div>
  );
};

export default withApollo(
  compose(
    withDeleteLink,
    withFeed
  )(LinkList)
);
