import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    Box,
    TextField,
    Switch,
    FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useState, useContext, SyntheticEvent, useEffect} from 'react';
import { BoardApi } from "../api/BoardApi";
import { toast } from 'react-toastify';
import {useLocation, useNavigate} from 'react-router-dom';
import {UserContext} from "../context/UserContext";
import {ACCESS_TOKEN} from "../constants/constants";
import {ThemeContext} from "../context/ThemeContext";
import {Container} from "./Header.style";

const Header = () => {
    const [title, setTitle] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { currentUser, currentUserModifier } = useContext(UserContext);
    const { toggleTheme } = useContext(ThemeContext);
    const { isDark } = useContext(ThemeContext)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            cardLists: null,
            imagePath: selectedImage
        });
        setTitle('')
        handleClose()
        toast.success("Board created");
        navigate("/boards");
    };
    const logout = () => {
        currentUserModifier(null);
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('currentUser');
        navigate("/");
        window.location.reload()
    };

    useEffect(() => {
        console.log(currentUser, "current userrrrr")
    }, [currentUser]);

    return (
        <AppBar position="fixed">
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
                                    <TextField
                                        id="outlined-basic"
                                        placeholder="Your new board title..."
                                        variant="outlined"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        style={{width: "15rem", margin: "1rem" }}
                                    />
                                    <RadioGroup
                                        aria-label="images"
                                        value={selectedImage}
                                        onChange={(e: { target: { value: React.SetStateAction<string | null>; }; }) => setSelectedImage(e.target.value)}
                                        style={{flexDirection: "row", justifyContent: "center", margin: "1rem -0.75rem 1rem 1rem" }}
                                    >
                                        {['/1.jpg', '/2.jpg', '/3.jpg'].map((img, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={img}
                                                control={<Radio style={{ display: 'none' }} />}
                                                label={
                                                    <img
                                                        src={img}
                                                        alt={`Image ${index + 1}`}
                                                        style={{
                                                            width: '70px',
                                                            margin: '0.25rem',
                                                            border: selectedImage === img ? '2px solid white' : 'none',
                                                            borderRadius: "0.25rem"
                                                        }}
                                                    />
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                    <Container>
                                        <Button variant="contained" type="submit" disabled={!selectedImage} sx={{ mt: 2 }}>Save</Button>
                                    </Container>
                                </form>
                            </Box>
                        </Menu>
                        <Button color="inherit" href="/boards">Boards</Button>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                        <Switch checked={isDark} onChange={toggleTheme}></Switch>
                    </> :
                    <>
                        <Button color="inherit" href="/signup">Sign Up</Button>
                        <Button color="inherit" href="/login">Login</Button>
                        <Switch checked={isDark} onChange={toggleTheme}></Switch>
                    </>}
            </Toolbar>
        </AppBar>
    );
}

export default Header;