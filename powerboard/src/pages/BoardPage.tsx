import React, {useCallback, useContext, useEffect, useState} from "react";
import './BoardsPage.css';
import AddListButton from "../components/AddListButton";
import {BoardContext} from "../context/BoardContext";
import {Body, Container} from "./BoardPage.style";
import {
    DndContext,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent, DragStartEvent, closestCorners, DragOverlay, DragOverEvent,
} from "@dnd-kit/core";
import {
    verticalListSortingStrategy,
    sortableKeyboardCoordinates, SortableContext
} from '@dnd-kit/sortable';
import {CardResponse} from "../api/models/CardResponse";
import {CardListResponse} from "../api/models/CardListResponse";
import SortableCardList from "../components/SortableCardList";
import {CustomMouseSensor} from "../sensors/CustomMouseSensor";
import {CustomKeyboardSensor} from "../sensors/CustomKeyboardSensor";
import BoardHeader from "../components/BoardHeader";
import HoverableCardText from "../components/HoverableCardText";
import CardList from "../components/CardList";
import {CardApi} from "../api/CardApi";
import {CardSwapRequest} from "../api/models/CardSwapRequest";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {sendMessageWithBoardUpdate} from "../message/MessageSender";

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
            cardListId: cardList.id,
            orderNum: card.orderNum
        }));

        await CardApi.swapCard(requests, context.currentBoard?.id);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setIsDragging(false);
        context.isDraggingModifier(false);

        if(context.currentBoard){
            sendMessageWithBoardUpdate({
                id: context.currentBoard.id,
                title: context.currentBoard.title,
                users: context.currentBoard.users,
                cardLists: context.currentBoard.cardLists,
                owner: context.currentBoard.owner,
                imagePath: context.currentBoard.imagePath})
        }

        if(context.currentBoard && over) {
            let targetList = findCardListContainer(context.currentBoard?.cardLists, over.id as string);
            if(!active || !over || active.id === over.id && previousList != targetList){
                if(targetList && previousList) {
                    const activeCardIndex = previousList.cards.findIndex(card => card.id !== undefined && card.id.toString() === active.id);
                    const [removedCard] = previousList.cards.splice(activeCardIndex, 1);
                    if(removedCard && removedCard.cardList) {
                        removedCard.cardList.id = targetList.id;
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
            }

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

            if (!context.currentBoard?.cardLists) {
                return;
            }


            const overCardIndex = cards.findIndex(card => card.id !== undefined && card.id.toString() === over.id);
            if (targetList) {
                if (!targetList.cards.some(card => card.id === removedCard.id)) {
                    if (overCardIndex !== -1) {
                        if (activeCardIndex - overCardIndex <= 0) {
                            // DOWN
                            let overCard = targetList.cards[overCardIndex];
                            removedCard.orderNum = overCard.orderNum + 1
                            targetList.cards.splice(overCardIndex + 1, 0, removedCard);
                            targetList.cards.forEach((card, index) => {
                                card.orderNum = index + 1;
                            });
                            swapCards(targetList.cards, targetList)
                        } else {
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
                        targetList.cards.push(removedCard);
                        removedCard.orderNum = targetList.cards.length
                    }
                    updateListWithNewCards(targetList, targetList.cards);
                }
                return;
            }

            targetList = context.currentBoard?.cardLists.find(list => list.cards.length === 0);
            if (previousList && targetList && !targetList.cards.some(card => card.id === removedCard.id)) {
                if (overCardIndex !== -1) {
                    targetList.cards.splice(overCardIndex, 0, removedCard);
                } else {
                    targetList.cards.push(removedCard);
                    if(removedCard && removedCard.cardList) {
                        removedCard.cardList.id = targetList.id;
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
                updateListWithNewCards(targetList, targetList.cards);
            }
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
                if (existingList.id === list.id) {
                    return {...existingList, cards: newCards};
                } else {
                    return existingList;
                }
            });

            context.updateCardLists(updatedCardList);

            if (context.currentCardList && list.id === context.currentCardList.id) {
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
            overList = context.currentBoard.cardLists.find(list => list.id === over?.id);
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
            if (existingList.id === activeList.id) {
                return updatedActiveList;
            } else if (overList && existingList.id === overList.id) {
                return updatedOverList;
            } else {
                return existingList;
            }
        });

        context.updateCardLists(updatedCardList);
        if (context.currentCardList && (activeList.id === context.currentCardList.id || overList.id === context.currentCardList.id)) {
            context.currentCardListModifier(updatedActiveList.id === context.currentCardList.id ? updatedActiveList : updatedOverList);
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
    const fetchBoard = useCallback(async (boardId: string) => {
        try {
            const response = await BoardApi.getBoard({boardId: boardId});
            context.currentBoardModifier(response.data)
        } catch {
            toast.error("Server error")
        }

    }, []);

    useEffect(() => {
        console.log(context.currentBoard?.cardLists, "current");
    }, [context.currentBoard]);

    useEffect(() => {
        setCards(context.currentCardList?.cards || []);
    }, [context.currentCardList]);

    useEffect(() => {
        const sock = new SockJS('http://localhost:8080/stomp');
        const client = Stomp.over(sock);

        const connectCallback = () => {
            client.subscribe('/topic/messages', (payload) => {
                const newMessage = JSON.parse(payload.body);
                if(newMessage){
                    if(context.currentBoard){
                        let id: string = context.currentBoard.id.toString()
                        if(newMessage.id.toString() === id) {
                            context.currentBoardModifier(newMessage)
                        }
                    }
                }
            });
        };

        client.connect({}, connectCallback);

        return () => {
            client.disconnect(() => {
            });
        };
    }, []);


    return (
        <Body backgroundImage={context.currentBoard?.imagePath || ''}>
            <BoardHeader />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "start"}}>
            <Container>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
                    <SortableContext items={
                        context.currentBoard
                            ? context.currentBoard.cardLists.flatMap(cardList => cardList.cards.map(card => card.id.toString()))
                            : []
                    } strategy={verticalListSortingStrategy}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {context.currentBoard?.cardLists.sort((a, b) => a.id - b.id).map((cardList, index) => (
                                <div key={`div-${cardList.id}`}>
                                    {
                                        context.isDragging ?
                                            <SortableCardList cardList={cardList} key={cardList.id}/> :
                                            <CardList cardList={cardList} key={cardList.id}/>
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
        </Body>
    )
}
export default BoardPage;