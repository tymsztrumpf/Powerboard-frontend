import {CustomAppBar, StyledBox, StyledButton, StyledModal, StyledPersonAddAltIcon} from "../pages/BoardPage.style";
import {
    Autocomplete,
    Avatar, Button,
    Container,
    List,
    ListItem,
    ListItemText,
    Modal,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {BoardContext} from "../context/BoardContext";
import {ThemeContext} from "../context/ThemeContext";
import {BoardApi} from "../api/BoardApi";
import {UserResponse} from "../api/models/UserResponse";
import {toast} from "react-toastify";
import {UserContext} from "../context/UserContext";
import {UserApi} from "../api/UserApi";

const BoardHeader = () => {
    const context = useContext(BoardContext)
    const themeContext = useContext(ThemeContext)
    const currentUser = useContext(UserContext)
    const [userEmail, setUserEmail] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
    const removeUser = async (userEmail: string) => {
        try {
            await BoardApi.removeUser({
                userEmail: userEmail,
                boardId: context.currentBoard?.id
            });

            if(context.currentBoard) {
                const updatedUserList = context.currentBoard.users.filter(user => user.email !== userEmail);

                context.currentBoardModifier({
                    ...context.currentBoard,
                    users: updatedUserList,
                });

                setUsers(updatedUserList);
            }

            toast.success("Usunięto użytkownika");
        } catch {
            toast.error("Błąd serwera przy usuwaniu użytkownika");
        }
    };
    const fetchUsers = useCallback(async () => {
        try {
            const response = await UserApi.getAllUsers();
            setUsers(response.data)
        } catch {
            toast.error("Bład serwera")
        }

    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
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
                                        {context.currentBoard?.owner.email === currentUser.currentUser?.email && currentUser.currentUser?.email !== user.email && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => removeUser(user.email)}
                                            >
                                                DELETE
                                            </Button>
                                        )}
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
    )
}

export default BoardHeader;