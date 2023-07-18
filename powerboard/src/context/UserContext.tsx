import {UserContextType} from "../models/UserContextType";
import {User} from "../models/User";
import {createContext, useEffect, useState} from "react";

const defaultSetting: UserContextType = {
    currentUser: null,
    currentUserModifier: (user: User | null) => {}
}

export const UserContext = createContext<UserContextType>(defaultSetting)

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const currentUserModifier = (user: User | null) => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
        setCurrentUser(user);
    }

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, currentUserModifier }}> {children} </UserContext.Provider>
    )
}