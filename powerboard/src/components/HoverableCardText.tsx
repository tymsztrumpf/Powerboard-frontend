import React, {useContext, useState} from "react";
import Typography from '@mui/material/Typography';
import {
    BodyContainer,
    Container,
    ListTypography,
    StyledAddButton,
    StyledBox, StyledCDeleteForeverIcon,
    StyledCloseIcon,
    StyledModalBox,
    StyledTextareaAutosize,
    StyledTextField,
    StyledTypography,
    TitleContainer
} from "./HoverableCardText.style";
import {BoardContext} from "../context/BoardContext";
import {CardListResponse} from "../api/models/CardListResponse";
import {Avatar, Box, Button, Menu, MenuItem, Modal} from "@mui/material";
import {CardResponse} from "../api/models/CardResponse";
import {ThemeContext} from "../context/ThemeContext";
import CreateIcon from '@mui/icons-material/Create';
import PeopleIcon from '@mui/icons-material/People';
import {toast} from "react-toastify";
import {CardApi} from "../api/CardApi";
import {UserResponse} from "../api/models/UserResponse";
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';

interface Props {
    cardList: CardListResponse
    card: CardResponse
}
const HoverableCardText = ({ card, cardList }: Props) => {
    const context = useContext(BoardContext)
    const themeContext = useContext(ThemeContext)
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [newDescription, setNewDescription] = useState(card.description)
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const handleHeaderClick = () => {
        setIsEditing(true);
    };
    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewTitle(event.target.value);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const setCurrentCardList = () => {
        context.currentCardListModifier(cardList)
    }
    const setCurrentCard = () => {
        if(!context.isDragging) {
            context.currentCardModifier(card)
        }
    }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget)
    };

    const handleCloseUserMenu = (user: UserResponse) => {
        addUser(user)
        setAnchorEl(null);
    };
    const handleBlur = async () => {
        try {

            await CardApi.updateCard({
                title: newTitle,
                cardListId: cardList.Id,
                description: newDescription,
            }, card.id, context.currentBoard?.id, cardList.Id);

            if(context.currentBoard) {
                const updatedCardLists = context.currentBoard.cardLists.map(list => {
                    if (list.Id === cardList.Id) {
                        return {
                            ...list,
                            cards: list.cards.map(c => {
                                if (c.id === card.id)
                                    return {...c, title: newTitle, description: newDescription}
                                else return c
                            })
                        }
                    } else return list
                })

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardLists,
                });
                if (context.currentCard && context.currentCard.id) {
                    context.currentCardModifier({
                        ...context.currentCard,
                        title: newTitle,
                        description: newDescription
                    });
                }
            }
            toast.success("Card title updated");
        } catch (error) {
            toast.error("Something went wrong");
        }
        setIsEditing(false);
        setIsEditingDescription(false)
    };
    const addUser = async (user: UserResponse) => {

        try {
            const newUserResponse = await CardApi.addUser({
                cardId: card.id,
                cardListId: cardList.Id,
                boardId: context.currentBoard?.id,
                userEmail: user.email,
            });

            const newUser: UserResponse = {
                email: newUserResponse.data.email,
                firstName: newUserResponse.data.firstName,
                lastName: newUserResponse.data.lastName
            };

            if(context.currentBoard) {
                const updatedCardLists = context.currentBoard.cardLists.map(cardList => {
                    return {
                        ...cardList,
                        cards: cardList.cards.map(cardInList => {
                            if (cardInList.id === card.id) {
                                return {
                                    ...cardInList,
                                    executors: [...cardInList.executors, newUser],
                                };
                            }

                            return cardInList;
                        }),
                    };
                });

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardLists,
                });

            }
        } catch {

            toast.error("Server error");
        }

    };
    const handleDeleteCard = async () => {
        try {
            await CardApi.deleteCard(card.id, context.currentBoard?.id, cardList.Id);

            if (context.currentBoard) {
                const updatedCardLists = context.currentBoard.cardLists.map(list => {
                    if (list.Id === cardList.Id) {
                        return {
                            ...list,
                            cards: list.cards.filter(c => c.id !== card.id)
                        };
                    } else return list;
                });

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardLists,
                });
            }
            toast.success("Card deleted");
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setNewDescription(event.target.value);
    const handleDescriptionClick = () => setIsEditingDescription(true);

    return (
        <>
        <StyledBox
            onMouseEnter={() => {
                setHover(true);
                setCurrentCardList();
                setCurrentCard();
            }}
            onMouseLeave={() => setHover(false)}
            hover={hover}
        >
            <Typography variant="body1">{card.title}</Typography>
            <div
                className="card-executors"
                style={{
                    position: 'absolute',
                    right: 5,
                    bottom: 5,
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                {card.executors.map((user, userIndex) => (
                    <Avatar
                        key={user.email}
                        alt={user.firstName ? user.firstName.toUpperCase() : ''}
                        sx={{
                            width: 24,
                            height: 24,
                            marginRight: 2
                        }}
                        src="/static/images/avatar/2.jpg"
                    />
                ))}
            </div>
            {hover && (
                <Button
                    data-no-dnd="true"
                    onClick={handleOpen}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0
                    }}
                >
                    <CreateIcon fontSize={"small"} color={"secondary"}/>
                </Button>
            )}
        </StyledBox>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description" data-no-dnd="true">
                <StyledModalBox bgcolor={themeContext.theme.palette.background.paper}>
                    <StyledCloseIcon onClick={handleClose}/>
                    <Container>

                        <TitleContainer>
                            <SubtitlesIcon fontSize={"large"}/>
                            {
                                isEditing ? (
                                    <StyledTextField
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        type="text"
                                        variant="outlined"
                                        value={newTitle}
                                        autoFocus
                                    />
                                ) : (
                                    <Typography id="modal-modal-title" variant="h6" onClick={handleHeaderClick}>
                                        {card.title}
                                    </Typography>
                                )
                            }

                        </TitleContainer>
                        <BodyContainer>
                            <ListTypography fontSize={"small"} id="modal-modal-description">
                                On list {cardList.title}
                            </ListTypography>
                        </BodyContainer>

                        <TitleContainer>
                            <PeopleIcon fontSize={"large"}/>
                            <Typography>
                                Users
                            </Typography>
                            <StyledAddButton onClick={handleClick} color={"secondary"}>
                                <AddIcon />
                            </StyledAddButton>
                        </TitleContainer>
                        <BodyContainer>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                                {card.executors.map((user, index) => (
                                    <Avatar key={index} alt={user.firstName ? user.firstName.toUpperCase(): ''} src="/static/images/avatar/2.jpg" />
                                ))}
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                >
                                    {context.currentBoard?.users.map((user) => (
                                        <MenuItem data-no-dnd="true" key={user.email} onClick={() => handleCloseUserMenu(user)}>{user.email}</MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </BodyContainer>
                        <TitleContainer>
                            <CommentIcon fontSize={"large"}/>
                            <Typography>
                                Description
                            </Typography>
                        </TitleContainer>
                        {
                            isEditingDescription ? (
                                <StyledTextareaAutosize
                                    color={themeContext.theme.palette.secondary.main}
                                    onChange={handleDescriptionChange}
                                    onBlur={handleBlur}
                                    defaultValue={card.description}
                                    aria-label="minimum height"
                                    minRows={3}
                                    placeholder="Notatka"
                                />
                            ) : (
                                <StyledTypography fontSize={"small"} id="modal-modal-description" variant="h6" onClick={handleDescriptionClick}>
                                    {card.description ? card.description : "Add description..."}
                                </StyledTypography>
                            )
                        }
                    </Container>
                    <StyledCDeleteForeverIcon onClick={handleDeleteCard}/>
                </StyledModalBox>
            </Modal>
        </>
    );
};

export default HoverableCardText;