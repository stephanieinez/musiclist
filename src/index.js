import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';

import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './components/App';
import './index.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Switch>
        <Route exact path="/" component={App} />
      </Switch>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
