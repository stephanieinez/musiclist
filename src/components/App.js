import React from 'react';

import CreateLink from './CreateLink';
import TrackList from './TrackList';
import Header from './Header';

const App = () => (
  <div>
    <div>
      <Header />
      <CreateLink />
      <TrackList />
    </div>
  </div>
);

export default App;
