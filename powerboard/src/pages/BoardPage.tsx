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
import {BoardApi} from "../api/BoardApi";
import {BoardRequest} from "../api/models/BoardRequest";
import { toast } from "react-toastify";
import {CardApi} from "../api/CardApi";
import {CardListApi} from "../api/CardListApi";
import {CardSwapRequest} from "../api/models/CardSwapRequest";

const BoardPage = () => {
    const context = useContext(BoardContext)
    const [cards, setCards] = useState<CardResponse[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [activeItem, setActiveItem] = useState<CardResponse>()
    const [previousList, setPreviousList] = useState<CardListResponse | null>(null);
    const sensors = useSensors(
        useSensor(CustomMouseSensor),
        useSensor(TouchSensor),
        useSensor(CustomKeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const swapCards = async (cards: CardResponse[], cardList: CardListResponse) => {
        const requests: CardSwapRequest[] = cards.map(card => ({
            id: card.id,
            cardListId: cardList.Id,
            orderNum: card.orderNum
        }));

        await CardApi.swapCard(requests, context.currentBoard?.id);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setIsDragging(false);
        context.isDraggingModifier(false);
        if (!active || !over || active.id === over.id) {
            if(over && context.currentBoard) {
                let targetList = findCardListContainer(context.currentBoard?.cardLists, over.id as string);
                if(targetList && previousList){
                    const activeCardIndex = previousList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);
                    const [removedCard] = previousList.cards.splice(activeCardIndex, 1);
                    removedCard.cardList = targetList;
                    previousList.cards.forEach((card, index) => {
                        card.orderNum = index + 1;
                    });
                    targetList.cards.forEach((card, index) => {
                        card.orderNum = index + 1;
                    });
                    swapCards(targetList.cards, targetList)
                    swapCards(previousList.cards, previousList);
                }
            }
            return;
        }

        const originalList = context.currentBoard?.cardLists.find(list => list.cards.some(card => card.id.toString() === active.id));
        if (!originalList) {
            console.log("2")
            return;
        }

        const activeCardIndex = originalList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);
        console.log("ACTIVE",activeCardIndex)
        if (activeCardIndex === -1) {
            console.log("3")
            return;
        }

        const [removedCard] = originalList.cards.splice(activeCardIndex, 1);
        updateListWithNewCards(originalList, originalList.cards);

        if (!context.currentBoard?.cardLists){
            console.log("4")
            return;
        }

        let targetList = findCardListContainer(context.currentBoard?.cardLists, over.id as string);
        const overCardIndex = cards.findIndex(card => card.id !== undefined && card.id.toString() === over.id);
        if (targetList) {
            if (!targetList.cards.some(card => card.id === removedCard.id)) {
                if (overCardIndex !== -1) {
                    if(activeCardIndex - overCardIndex <= 0 ) {
                        console.log("5")
                        // DOWN
                        let overCard = targetList.cards[overCardIndex];
                        removedCard.orderNum = overCard.orderNum + 1
                        targetList.cards.splice(overCardIndex + 1, 0, removedCard);
                        targetList.cards.forEach((card, index) => {
                            card.orderNum = index + 1;
                        });
                        swapCards(targetList.cards, targetList)
                    }
                    else {
                        console.log("6")
                        // UP
                        let overCard = targetList.cards[overCardIndex];
                        removedCard.orderNum = overCard.orderNum - 1
                        targetList.cards.splice(overCardIndex, 0, removedCard);
                        targetList.cards.forEach((card, index) => {
                            card.orderNum = index + 1;
                        });
                        swapCards(targetList.cards, targetList)
                    }
                } else {
                    console.log("7")
                    targetList.cards.push(removedCard);
                    removedCard.orderNum = targetList.cards.length
                    console.log(context.currentBoard.cardLists)
                }
                updateListWithNewCards(targetList, targetList.cards);
            }
            return;
        }

        targetList = context.currentBoard?.cardLists.find(list => list.cards.length === 0);
        if (previousList && targetList && !targetList.cards.some(card => card.id === removedCard.id)) {
            if (overCardIndex !== -1) {
                console.log("8")
                targetList.cards.splice(overCardIndex, 0, removedCard);
            } else {
                console.log("9")
                targetList.cards.push(removedCard);
                removedCard.cardList = targetList;
                previousList.cards.forEach((card, index) => {
                    card.orderNum = index + 1;
                });
                targetList.cards.forEach((card, index) => {
                    card.orderNum = index + 1;
                });
                swapCards(targetList.cards, targetList)
                swapCards(previousList.cards, previousList);
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
        if (!context.currentBoard?.cardLists) {
            return;
        }
        const activeList = findCardListContainer(context.currentBoard.cardLists, active.id as string);
        if (!activeList) {
            return;
        }

        let overList = over ? findCardListContainer(context.currentBoard.cardLists, over.id as string) : null;

        if (!overList) {
            overList = context.currentBoard.cardLists.find(list => list.cards.length === 0);
        }

        if (!overList || activeList === overList) {
            return;
        }

        const activeIndex = activeList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);

        if (activeIndex === -1) {
            return;
        }

        const removedCard = activeList.cards[activeIndex];
        const newActiveListCards = [...activeList.cards.filter((_, index) => index !== activeIndex)];

        const overIndex = over ? overList.cards.findIndex(card => card.id !== undefined && card.id.toString() === over.id) : overList.cards.length;

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
            } else if (overList && existingList.Id === overList.Id) {
                return updatedOverList;
            } else {
                return existingList;
            }
        });

        context.updateCardLists(updatedCardList);
        if (context.currentCardList && (activeList.Id === context.currentCardList.Id || overList.Id === context.currentCardList.Id)) {
            context.currentCardListModifier(updatedActiveList.Id === context.currentCardList.Id ? updatedActiveList : updatedOverList);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setIsDragging(true)
        context.isDraggingModifier(true)
        const { active } = event
        setActiveItem(cards.find((item) => item.id === active.id))
        if(context.currentBoard) {
            const currentList = findCardListContainer(context.currentBoard?.cardLists, event.active.id as string);
            if(currentList) {
                setPreviousList(currentList);
            }
        }
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