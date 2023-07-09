import { AppBar, Toolbar, Typography, Button, IconButton, Menu, Box, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useContext, SyntheticEvent } from 'react';
import { BoardApi } from "../api/BoardApi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../context/UserContext";

const Header = () => {
    const [title, setTitle] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { currentUser, currentUserModifier } = useContext(UserContext);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const saveBoard = async (e: SyntheticEvent) => {
        e.preventDefault();

        await BoardApi.createBoard({
            title: title,
        });

        handleClose()
        setTitle('')
        toast.success("Board created");
    };
    const logout = () => {
        currentUserModifier(null);
        localStorage.removeItem('ACCESS_TOKEN');
        navigate("/");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                </IconButton>
                <Typography variant="h6"  component="div" sx={{ flexGrow: 1 }}>
                    Powerboard
                </Typography>
                {currentUser ?
                    <>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleMenu}
                        >
                            Create
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <Box sx={{ p: 2 }}>
                                <form onSubmit={saveBoard}>
                                    <TextField id="outlined-basic" label="Title" variant="outlined" value={title} onChange={e => setTitle(e.target.value)}/>
                                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>Save</Button>
                                </form>
                            </Box>
                        </Menu>
                        <Button color="inherit" href="/boards">Boards</Button>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </> :
                    <>
                        <Button color="inherit" href="/signup">Sign Up</Button>
                        <Button color="inherit" href="/login">Login</Button>
                    </>}
            </Toolbar>
        </AppBar>
    );
}

export default Header;