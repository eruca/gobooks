import { IDictsState } from './dicts/dicts';
import { IUsersState } from './users/users';
import { IAuthorsState } from './authors/authors';
import { IBooksState } from './books/books';

export default interface RootState {
    users: IUsersState;
    dicts: IDictsState;
    authors: IAuthorsState;
    books: IBooksState;
}
