import {BoardContextType} from "../models/BoardContextType";
import {Board} from "../models/Board";
import {createContext, useState} from "react";
import {CardListResponse} from "../api/models/CardListResponse";
import {UserResponse} from "../api/models/UserResponse";

const defaultSetting: BoardContextType = {
    currentBoard: null,
    currentCardList: null,
    currentBoardModifier: (board: Board | null) => {},
    updateCardLists: (newCardLists: CardListResponse[] | null) => {},
    currentCardListModifier: (cardList: CardListResponse | null) => {},
}

export const BoardContext = createContext<BoardContextType>(defaultSetting)

export const BoardContextProvider = ({ children }: React.PropsWithChildren) => {
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
    const [currentCardList, setCurrentCardlist] = useState<CardListResponse | null>(null)
    const currentBoardModifier = (board: Board | null) => {
        setCurrentBoard(board)
    }
    const currentCardListModifier = (cardList: CardListResponse | null) => {
        setCurrentCardlist(cardList)
    }
    const updateCardLists = (newCardLists: CardListResponse[]) => {
        if (currentBoard) {
            const updatedBoard = { ...currentBoard };
            updatedBoard.cardLists = newCardLists;
            setCurrentBoard(updatedBoard);
        }
    }

    return (
        <BoardContext.Provider value={{ currentBoard, currentBoardModifier, updateCardLists, currentCardList, currentCardListModifier}}> {children} </BoardContext.Provider>
    )
}