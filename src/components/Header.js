import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: 2em;
  margin-bottom: 1em;
`;

const Header = () => <Logo src="./logo.png" />;

export default Header;
