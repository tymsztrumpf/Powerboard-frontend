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
    KeyboardSensor, DragEndEvent, DragStartEvent, closestCorners, DragOverlay, DragOverEvent,
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
import BoardHeader from "../components/BoardHeader";
import HoverableCardText from "../components/HoverableCardText";
import CardList from "../components/CardList";

const BoardPage = () => {
    const context = useContext(BoardContext)
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [isDragging, setIsDragging] = useState(false);
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

        setIsDragging(false);
        context.isDraggingModifier(false);
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
                    if(activeCardIndex - overCardIndex <= 0 ) {
                        targetList.cards.splice(overCardIndex + 1, 0, removedCard);
                    }
                    else {
                    targetList.cards.splice(overCardIndex, 0, removedCard);
                    }
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
    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (context.currentBoard?.cardLists) {
            const activeList = findCardListContainer(context.currentBoard.cardLists, active.id as string);
            const overList = over ? findCardListContainer(context.currentBoard.cardLists, over.id as string) : null;

            if (!activeList || !overList || activeList === overList) {
                return;
            }

            const activeIndex = activeList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);
            if (over) {
                const overIndex = overList.cards.findIndex(card => card.id !== undefined && card.id.toString() === over.id);

                if (activeIndex === -1 || overIndex === -1) {
                    return;
                }

                const removedCard = activeList.cards[activeIndex];
                const newActiveListCards = [...activeList.cards.filter((_, index) => index !== activeIndex)];

                const newOverListCards = [
                    ...overList.cards.slice(0, overIndex),
                    removedCard,
                    ...overList.cards.slice(overIndex)
                ];

                const updatedActiveList = { ...activeList, cards: newActiveListCards };
                const updatedOverList = { ...overList, cards: newOverListCards };

                const updatedCardList = context.currentBoard.cardLists.map(existingList => {
                    if (existingList.Id === activeList.Id) {
                        return updatedActiveList;
                    } else if (existingList.Id === overList.Id) {
                        return updatedOverList;
                    } else {
                        return existingList;
                    }
                });

                context.updateCardLists(updatedCardList);
                if (context.currentCardList && (activeList.Id === context.currentCardList.Id || overList.Id === context.currentCardList.Id)) {
                    context.currentCardListModifier(updatedActiveList.Id === context.currentCardList.Id ? updatedActiveList : updatedOverList);
                }
            }
        }
    };
    const handleDragStart = (event: DragStartEvent) => {
        setIsDragging(true)
        context.isDraggingModifier(true)
        const { active } = event
        setActiveItem(cards.find((item) => item.id === active.id))
    }

    useEffect(() => {
        setCards(context.currentCardList?.cards || []);
    }, [context.currentCardList]);


    return (
        <>
            <BoardHeader />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "start" }}>
            <Container>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
                    <SortableContext items={
                        context.currentBoard
                            ? context.currentBoard.cardLists.flatMap(cardList => cardList.cards.map(card => card.id.toString()))
                            : []
                    } strategy={verticalListSortingStrategy}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {context.currentBoard?.cardLists.sort((a, b) => a.Id - b.Id).map((cardList, index) => (
                                <div key={`div-${cardList.Id}`}>
                                    {
                                        context.isDragging ?
                                            <SortableCardList cardList={cardList} key={cardList.Id}/> :
                                            <CardList cardList={cardList} key={cardList.Id}/>
                                    }
                                </div>
                            ))}
                            <AddListButton />
                        </div>
                    </SortableContext>
                    <DragOverlay>
                        {isDragging && context.currentCard && context.currentCardList ? (
                            <HoverableCardText card={context.currentCard} cardList={context.currentCardList}/>
                        ): null}
                    </DragOverlay>
                </DndContext>
            </Container>
            </div>
        </>
    )
}
export default BoardPage;