import { Todo } from "./Todo"

export interface Bucket {
    id: number;
    name: string;
    todos: Todo[];
}