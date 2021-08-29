import Hub from './hub';
import {
    UsersNewForm,
    UsersTableConfig,
    UsersSearch,
} from '@/components/Forms/Users';
import {
    DictsNewForm,
    DictsTableConfig,
    DictsSearch,
} from '@/components/Forms/Dicts';
import {
    AuthorsTableConfig,
    AuthorsNewForm,
    AuthorsSearch,
} from '@/components/Forms/Authors';
import {
    BooksNewForm,
    BooksSearch,
    BooksTableConfig,
} from '@/components/Forms/Books';

const hub = new Hub();

// Users
// --------------------------------------------------
hub.register({
    name: 'UsersNewForm',
    component: UsersNewForm,
    defaultProps: {},
    useRef: true,
});

hub.register({
    name: 'UsersTableConfig',
    component: UsersTableConfig,
    defaultProps: {},
    useRef: false,
});

hub.register({
    name: 'UsersSearch',
    component: UsersSearch,
    defaultProps: {},
    useRef: false,
});

// Dicts
// --------------------------------------------------
hub.register({
    name: 'DictsNewForm',
    component: DictsNewForm,
    defaultProps: {},
    useRef: true,
});

hub.register({
    name: 'DictsTableConfig',
    component: DictsTableConfig,
    defaultProps: {},
    useRef: false,
});

hub.register({
    name: 'DictsSearch',
    component: DictsSearch,
    defaultProps: {},
    useRef: false,
});

// Authors
// --------------------------------------------------

hub.register({
    name: 'AuthorsNewForm',
    component: AuthorsNewForm,
    defaultProps: {},
    useRef: true,
});

hub.register({
    name: 'AuthorsTableConfig',
    component: AuthorsTableConfig,
    defaultProps: {},
    useRef: false,
});

hub.register({
    name: 'AuthorsSearch',
    component: AuthorsSearch,
    defaultProps: {},
    useRef: false,
});

// Books
// -----------------------------------------------------
hub.register({
    name: 'BooksNewForm',
    component: BooksNewForm,
    defaultProps: {},
    useRef: true,
});

hub.register({
    name: 'BooksTableConfig',
    component: BooksTableConfig,
    defaultProps: {},
    useRef: false,
});

hub.register({
    name: 'BooksSearch',
    component: BooksSearch,
    defaultProps: {},
    useRef: false,
});

export default hub;
