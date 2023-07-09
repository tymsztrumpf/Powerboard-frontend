import {useState} from "react";
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import {StyledBox} from "./HoverableCardText.style";

interface Props {
    text: string
}
const HoverableCardText = ({ text }: Props) => {
    const [hover, setHover] = useState(false);

    return (
        <StyledBox
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            hover={hover}
        >
            <Typography variant="body1">{text}</Typography>
        </StyledBox>
    );
};

export default HoverableCardText;