import React, { useState } from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: 2em;
  margin-bottom: 1em;
`;

const Header = () => {
  const [switchLogo, setLogo] = useState(true);

  return (
    <div onMouseEnter={() => setLogo(false)} onMouseLeave={() => setLogo(true)}>
      {switchLogo ? <Logo src="./logo.png" /> : <Logo src="./logo-2.png" />}
    </div>
  );
};

export default Header;
