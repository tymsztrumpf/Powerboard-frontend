import {Card} from '@mui/material';
import {CSS} from '@dnd-kit/utilities';
import {useSortable} from '@dnd-kit/sortable';
import HoverableCardText from "./HoverableCardText";
import {DragStartEvent} from "@dnd-kit/core";
import {BoardContext} from "../context/BoardContext";
import {useContext} from "react";
import {CardListResponse} from "../api/models/CardListResponse";
interface SortableCardProps {
    id: string;
    text: string;
    cardList: CardListResponse
}

const SortableCard: React.FC<SortableCardProps> = ({id, text, cardList}) => {
    const context = useContext(BoardContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});


    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <HoverableCardText cardList={cardList} text={text}></HoverableCardText>
        </Card>
    );
};

export default SortableCard;