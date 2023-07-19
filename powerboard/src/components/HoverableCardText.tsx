import {useContext, useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import {Container, StyledBox, StyledModal, StyledTextareaAutosize} from "./HoverableCardText.style";
import {BoardContext} from "../context/BoardContext";
import {CardListResponse} from "../api/models/CardListResponse";
import {Avatar, Box, Button, Modal, TextField} from "@mui/material";
import {CardResponse} from "../api/models/CardResponse";
import {ThemeContext} from "../context/ThemeContext";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
interface Props {
    cardList: CardListResponse
    card: CardResponse
}
const HoverableCardText = ({ card, cardList }: Props) => {
    const context = useContext(BoardContext)
    const themeContext = useContext(ThemeContext)
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const setCurrentCardList = () => {
        context.currentCardListModifier(cardList)
    }

    return (
        <>
        <StyledBox
            onDoubleClick={handleOpen}
            onMouseEnter={() => {
                setHover(true);
                setCurrentCardList();
            }}
            onMouseLeave={() => setHover(false)}
            hover={hover}
        >
            <Typography variant="body1">{card.title}</Typography>
        </StyledBox>
    <Modal
        data-no-dnd="true"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <StyledModal bgcolor={themeContext.theme.palette.text.secondary}>
            <Container>
            <Typography id="modal-modal-title" variant="h3" component="h1" sx={{mb: 4}}>
                {card.title}
            </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                    <EditNoteRoundedIcon />
                    <Typography id="modal-modal-description">
                        Description
                    </Typography>
                </Box>
            {card.executors.map((user, index) => (
                <Avatar key={index} alt={user.firstName.toUpperCase()} src="/static/images/avatar/2.jpg" />
            ))}
            <StyledTextareaAutosize theme={themeContext}
                value={card.description}
                // onChange={changeDescription}
                aria-label="minimum height"
                minRows={3}
                placeholder="Notatka"
            />
            </Container>
        </StyledModal>
    </Modal>
        </>
    );
};

export default HoverableCardText;