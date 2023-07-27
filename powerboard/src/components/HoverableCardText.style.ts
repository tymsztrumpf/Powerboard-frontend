import styled from "styled-components";
import {Box, Button, CardContent, Modal, TextareaAutosize, TextField, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const StyledBox = styled.div<{ hover: boolean }>`
  border-radius: 15px;
  background-color: ${props => props.hover ? '#555' : '#696969'};
  padding: 1em;
  color: white;
  margin-bottom: 1em;
  position: relative;
`;
export const StyledModalBox = styled(Box)`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 50rem;
height: 35rem;
border-radius: 1rem;
padding: 3rem;
  `
;
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
  `
;
export const TitleContainer = styled.div`
display: flex;
flex-direction: row;
gap: 1rem;
align-items: center
`
;

export const BodyContainer = styled.div`
display: flex;
flex-direction: row;
gap: 1rem;
margin-bottom: 4rem;
`
;


export const StyledCardContent = styled(CardContent)`
display: flex;
flex-direction: row;
justify-content: space-between;
`
;

export const StyledTypography = styled(Typography)`
padding: 1rem;
&:hover {
    background: rgba(115, 115, 115, 0.5)
}
`
;

export const ListTypography = styled(Typography)`
padding-left: 1rem;
padding-right: 1rem;
`
;

export const StyledCloseIcon = styled(CloseIcon)`
margin-left: 97%;
padding: 0.3rem;
&:hover {
    border-radius: 50%;
    background: rgba(115, 115, 115, 0.5)
}
`
;
export const StyledTextField = styled(TextField)`
width: 16rem;
border-radius: 0.5rem;
`
;

export const StyledAddButton = styled(Button)`
  &:hover {
    background: rgba(115, 115, 115, 0.5)
  }
`