import React, {useCallback, useContext, useEffect, useState} from "react";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import CardList from "../components/CardList";
import {BoardContext} from "../context/BoardContext";

const BoardPage = () => {
    const context = useContext(BoardContext)

    useEffect(() => {
        console.log("CONTEXT PRINT= ", context.currentBoard);
    }, [context.currentBoard]);


    return (
        <>
            <h2>{context.currentBoard?.title}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {context.currentBoard?.cardLists.map((cardList, index) => (
                        <CardList key={index} cardList={cardList}/>
                ))}
                <AddListButton />
            </div>
        </>
    )
}

export default BoardPage;