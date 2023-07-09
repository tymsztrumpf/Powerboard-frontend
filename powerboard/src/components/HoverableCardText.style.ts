import styled from "styled-components";

export const StyledBox = styled.div<{ hover: boolean }>`
  border-radius: 15px;
  background-color: ${props => props.hover ? '#555' : '#696969'};
  padding: 1em;
  color: white;
  margin-bottom: 1em;
`;