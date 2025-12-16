import { Todo } from "./Todo"

export interface Bucket {
    id: string;
    name: string;
    todos: Todo[];
}