import React, {useCallback, useContext, useEffect, useState} from "react";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {BoardContext} from "../context/BoardContext";
import {
    Autocomplete,
    Avatar,
    Box, Button,
    Container,
    List, ListItem,
    ListItemText,
    Modal,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {CustomAppBar, StyledPersonAddAltIcon, StyledModal, StyledBox, StyledButton} from "./BoardPage.style";
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    KeyboardSensor, DragEndEvent, DragStartEvent, closestCorners, DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates, rectSortingStrategy, SortableContext
} from '@dnd-kit/sortable';
import {CardResponse} from "../api/models/CardResponse";
import {CardListResponse} from "../api/models/CardListResponse";
import SortableCardList from "../components/SortableCardList";
import {CustomMouseSensor} from "../sensors/CustomMouseSensor";
import {CustomKeyboardSensor} from "../sensors/CustomKeyboardSensor";
import {ThemeContext} from "../context/ThemeContext";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import {UserApi} from "../api/UserApi";
import {BoardResponse} from "../api/models/BoardResponse";
import {UserResponse} from "../api/models/UserResponse";
import {CardApi} from "../api/CardApi";

const BoardPage = () => {
    const context = useContext(BoardContext)
    const themeContext = useContext(ThemeContext)
    const [open, setOpen] = useState(false);
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [userEmail, setUserEmail] = useState<string | undefined>();
    const [activeItem, setActiveItem] = useState<CardResponse>()
    const sensors = useSensors(
        useSensor(CustomMouseSensor),
        useSensor(TouchSensor),
        useSensor(CustomKeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!active || !over || active.id === over.id) {
            return;
        }

        const originalList = context.currentBoard?.cardLists.find(list => list.cards.some(card => card.id.toString() === active.id));
        if (!originalList) {
            return;
        }

        const activeCardIndex = originalList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);
        if (activeCardIndex === -1) {
            return;
        }

        const [removedCard] = originalList.cards.splice(activeCardIndex, 1);
        updateListWithNewCards(originalList, originalList.cards);

        if (!context.currentBoard?.cardLists){
            return;
        }

        let targetList = findCardListContainer(context.currentBoard?.cardLists, over.id as string);
        const overCardIndex = cards.findIndex(card => card.id !== undefined && card.id.toString() === over.id);

        if (targetList) {
            if (!targetList.cards.some(card => card.id === removedCard.id)) {
                if (overCardIndex !== -1) {
                    targetList.cards.splice(overCardIndex, 0, removedCard);
                } else {
                    targetList.cards.push(removedCard);
                }
                updateListWithNewCards(targetList, targetList.cards);
            }
            return;
        }

        targetList = context.currentBoard?.cardLists.find(list => list.cards.length === 0);
        if (targetList && !targetList.cards.some(card => card.id === removedCard.id)) {
            if (overCardIndex !== -1) {
                targetList.cards.splice(overCardIndex, 0, removedCard);
            } else {
                targetList.cards.push(removedCard);
            }
            updateListWithNewCards(targetList, targetList.cards);
        }
    };
    const findCardListContainer = (
        cardLists: CardListResponse[],
        id: string
    ) => {
        return cardLists.find((list) => list.cards.some((card) => card.id.toString() === id));
    };

    const updateListWithNewCards = (list: CardListResponse, newCards: CardResponse[]) => {
        if (context.currentBoard) {
            const updatedCardList = context.currentBoard.cardLists.map(existingList => {
                if (existingList.Id === list.Id) {
                    return {...existingList, cards: newCards};
                } else {
                    return existingList;
                }
            });

            context.updateCardLists(updatedCardList);

            if (context.currentCardList && list.Id === context.currentCardList.Id) {
                context.currentCardListModifier({...context.currentCardList, cards: newCards});
            }
        }
    }
    const fetchUsers = useCallback(async () => {
        try {
            const response = await UserApi.getAllUsers();
            setUsers(response.data)
        } catch {
            toast.error("Bład serwera")
        }

    }, []);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveItem(cards.find((item) => item.id === active.id))
    }
    const filterOptions = (options: string[], { inputValue }: { inputValue: string }) =>
        inputValue.length >= 1
            ? options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            )
            : [];

    const addUser = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        try {
            const newUserResponse = await BoardApi.addUser({
                userEmail: userEmail,
                boardId: context.currentBoard?.id
            });

            const newUser: UserResponse = {
                email: newUserResponse.data.email,
                firstName: newUserResponse.data.firstName,
                lastName: newUserResponse.data.lastName
            };

            if(context.currentBoard) {
                const updatedUserList = [...context.currentBoard.users, newUser]

                context.currentBoardModifier({
                    ...context.currentBoard,
                    users: updatedUserList,
                });

                setUsers(updatedUserList);
            }

            toast.success("Dodano Uzytkownika");
        } catch {

            toast.error("Błąd serwera przy dodawaniua uzytkownika");
        }

    };

    useEffect(() => {
        setCards(context.currentCardList?.cards || []);
    }, [context.currentCardList]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
        <>
            <CustomAppBar position="static" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {context.currentBoard?.title}
                    </Typography>
                    <StyledPersonAddAltIcon
                        onClick={handleOpen}
                        fontSize={"large"}
                        color={"primary"}
                    ></StyledPersonAddAltIcon>
                    <Modal
                        data-no-dnd="true"
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <StyledModal bgcolor={themeContext.theme.palette.background.paper}>
                            <Container>
                                <Typography id="modal-modal-title" variant="h5" component="h4" sx={{ mb: 8}}>
                                    Invite to a board
                                </Typography>
                                <StyledBox>
                                    <Autocomplete
                                        sx={{ width: '80%', marginRight: '1rem' }}
                                        disablePortal
                                        id="combo-box-demo"
                                        options={users.map((user) => user.email)}
                                        renderInput={(params) => <TextField {...params} label="Users" />}
                                        inputValue={userEmail}
                                        onInputChange={(event, value) => {
                                            setUserEmail(value);
                                        }}
                                        filterOptions={filterOptions}
                                    />
                                    <StyledButton variant="contained" color="primary" onClick={addUser}>
                                        Invite
                                    </StyledButton>
                                </StyledBox>
                                <Typography id="users-in-board-title" variant="h6" component="h5" sx={{ mt: 4, mb: 2 }}>
                                    Users
                                </Typography>
                                <List>
                                    {context.currentBoard?.users.map((user) => (
                                        <ListItem key={user.email}>
                                            <Avatar key={user.email} alt={user.firstName ? user.firstName.toUpperCase() : ''} sx={{ mr: 4 }} src="/static/images/avatar/2.jpg" />
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Typography variant="h6" component="span">
                                                            {user.firstName} {user.lastName}
                                                        </Typography>
                                                        <Typography variant="body2" component="p" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Container>
                        </StyledModal>
                    </Modal>
                    {context.currentBoard?.users.map((user, index) => (
                        <Avatar key={index} alt={user.firstName.toUpperCase()} src="/static/images/avatar/2.jpg" />
                    ))}
                </Toolbar>
            </CustomAppBar>
            <Container>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <SortableContext items={cards.map(card => card.id.toString())} strategy={rectSortingStrategy}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {context.currentBoard?.cardLists.sort((a, b) => a.Id - b.Id).map((cardList, index) => (
                                <div key={`div-${cardList.Id}`}>
                                    <SortableCardList cardList={cardList} key={cardList.Id}/>
                                </div>
                            ))}
                            <AddListButton />
                        </div>
                    </SortableContext>

                </DndContext>
            </Container>
        </>
    )
}
export default BoardPage;