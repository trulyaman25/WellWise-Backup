import styled from '@emotion/styled';

export const ScrollableContainer = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default ScrollableContainer;
