import React, {useContext} from "react";
import {BoardContext} from "../context/BoardContext";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Card} from "@mui/material";
import HoverableCardText from "./HoverableCardText";
import {CardListResponse} from "../api/models/CardListResponse";
import CardList from "./CardList";

interface SortableCardListProps {
    cardList: CardListResponse
}

const SortableCardList: React.FC<SortableCardListProps> = ({cardList}) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: cardList.Id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    }
    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} >
    <CardList cardList={cardList} />
    </Card>
);
};

export default SortableCardList;