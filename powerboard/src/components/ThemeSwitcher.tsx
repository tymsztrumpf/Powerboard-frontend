import { useState } from 'react';
import { Button, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface ThemeSwitcherProps {
    children: ReactNode;
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0d47a1', // głęboki odcień niebieskiego
        },
        secondary: {
            main: '#9e9e9e', // neutralny, jasny odcień szarości
        },
        background: {
            default: '#121212', // bardzo ciemny szary na tło
            paper: '#1e1e1e', // nieco jaśniejszy szary na elementy 'paper'
        },
        text: {
            primary: '#e0e0e0', // jasny szary na główny tekst
            secondary: '#9e9e9e', // neutralny, jasny szary na drugorzędny tekst
        },
    },
    shape: {
        borderRadius: 6,
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 16,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    spacing: 2,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // średni odcień niebieskiego
        },
        secondary: {
            main: '#ff4081', // jaskrawy, ale pastelowy róż
        },
        background: {
            default: '#fafafa', // bardzo jasny szary na tło
            paper: '#ffffff', // biały na elementy 'paper'
        },
        text: {
            primary: '#0d0d0d', // prawie czarny na główny tekst
            secondary: '#6d6d6d', // ciemnoszary na drugorzędny tekst
        },
    },
    shape: {
        borderRadius: 6,
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 16,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    spacing: 2,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});
const ThemeSwitcher = ({ children }: ThemeSwitcherProps) => {
    const [theme, setTheme] = useState(lightTheme);

    const handleThemeToggle = () => {
        setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
    };

    return (
        <ThemeProvider theme={theme}>
            <Button onClick={handleThemeToggle}>Toggle Theme</Button>
            {children}
        </ThemeProvider>
    );
};

export default ThemeSwitcher;