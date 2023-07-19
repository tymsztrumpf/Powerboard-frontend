import styled from "styled-components";
import {Box, Modal, TextareaAutosize} from "@mui/material";

export const StyledBox = styled.div<{ hover: boolean }>`
  border-radius: 15px;
  background-color: ${props => props.hover ? '#555' : '#696969'};
  padding: 1em;
  color: white;
  margin-bottom: 1em;
`;
export const StyledModal = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40rem;
  height: 50rem;
  border-radius: 2rem;
  padding: 3rem;
    `
;
export const StyledTextareaAutosize = styled(TextareaAutosize)`
    width: 20rem;
    border-radius: 1rem;
    padding: 1rem;
    border: none;
    font-family: Roboto, Helvetica, Arial, sans-serif;
`
;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`