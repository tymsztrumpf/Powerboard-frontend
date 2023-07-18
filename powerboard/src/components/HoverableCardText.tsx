import {useContext, useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import {StyledBox} from "./HoverableCardText.style";
import {BoardContext} from "../context/BoardContext";
import {CardListResponse} from "../api/models/CardListResponse";

interface Props {
    text: string
    cardList: CardListResponse
}
const HoverableCardText = ({ text, cardList }: Props) => {
    const context = useContext(BoardContext)
    const [hover, setHover] = useState(false);
    const setCurrentCardList = () => {
        context.currentCardListModifier(cardList)
    }

    return (
        <StyledBox
            onMouseEnter={() => {
                setHover(true);
                setCurrentCardList();
            }}
            onMouseLeave={() => setHover(false)}
            hover={hover}
        >
            <Typography variant="body1">{text}</Typography>
        </StyledBox>
    );
};

export default HoverableCardText;