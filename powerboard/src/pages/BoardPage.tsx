import React, {useCallback, useContext, useEffect, useState} from "react";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import CardList from "../components/CardList";
import {BoardContext} from "../context/BoardContext";
import {Avatar, Container, Toolbar, Typography} from "@mui/material";
import {CustomAppBar} from "./BoardPage.style";

const BoardPage = () => {
    const context = useContext(BoardContext)

    useEffect(() => {
        console.log("CONTEXT PRINT= ", context.currentBoard);
    }, [context.currentBoard]);

    // useEffect(() => {
    //     document.body.style.backgroundImage = `url(${TestImage})`;
    //     document.body.style.backgroundSize = 'cover';
    //     document.body.style.backgroundRepeat = 'no-repeat';
    //     document.body.style.height = '100vh';
    //     document.body.style.width = '100vw';
    //
    //     return () => {
    //         document.body.style.backgroundImage = '';
    //         document.body.style.backgroundSize = '';
    //         document.body.style.backgroundRepeat = '';
    //         document.body.style.height = '';
    //         document.body.style.width = '';
    //     };
    // }, []);

    return (
        <>
            <CustomAppBar position="static" color="primary" enableColorOnDark>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {context.currentBoard?.title}
                    </Typography>
                    {context.currentBoard?.users.map((user, index) => (
                        <Avatar key={index} alt={user.firstName.toUpperCase()} src="/static/images/avatar/2.jpg" />
                    ))}
                </Toolbar>
            </CustomAppBar>
            <Container>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {context.currentBoard?.cardLists.map((cardList, index) => (
                        <div key={index}>
                            <CardList key={index} cardList={cardList}/>
                        </div>
                    ))}
                    <AddListButton />
                </div>
            </Container>
        </>
    )
}

export default BoardPage;