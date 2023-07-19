import React, {useCallback, useContext, useEffect, useState} from "react";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import CardList from "../components/CardList";
import {BoardContext} from "../context/BoardContext";
import {Avatar, Container, Toolbar, Typography} from "@mui/material";
import {CustomAppBar} from "./BoardPage.style";
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    KeyboardSensor, DragEndEvent, DragStartEvent, closestCorners, DragOverlay,
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

const BoardPage = () => {
    const context = useContext(BoardContext)
    const [cards, setCards] = useState<CardResponse[]>([]);
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
                    targetList.cards.splice(overCardIndex, 0, removedCard);
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
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveItem(cards.find((item) => item.id === active.id))
    }

    useEffect(() => {
        setCards(context.currentCardList?.cards || []);
    }, [context.currentCardList]);

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
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <SortableContext items={cards.map(card => card.id.toString())} strategy={rectSortingStrategy}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {context.currentBoard?.cardLists.sort((a, b) => a.Id - b.Id).map((cardList, index) => (
                                <div key={`div-${cardList.Id}`}>
                                    <SortableCardList cardList={cardList} key={cardList.Id}/>
                                </div>
                            ))}
                            <AddListButton />
                        </div>
                    </SortableContext>

                </DndContext>
            </Container>
        </>
    )
}
export default BoardPage;