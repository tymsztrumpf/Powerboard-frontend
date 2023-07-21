import {AppBar, Autocomplete, Box, Button} from "@mui/material";
import styled, {withTheme} from "styled-components";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {Theme} from "@mui/system";
export const CustomAppBar = styled(AppBar)`
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  margin-top: -3rem;
  margin-bottom: 2rem;
`
export const StyledPersonAddAltIcon = styled(PersonAddAltIcon)`
    margin: 1rem;
    padding: 0.35rem;
    border-radius: 50%;
    &:hover {
        background-color: #e0e0e0;
`
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

export const StyledBox = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
;`

export const StyledButton = styled(Button)`
  width: 10rem;
  height: 3rem;
`
;