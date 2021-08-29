import { IAction } from '@/types/action';
import { IUser } from '@/types/users';
import {
    HomeOutlined,
    PieChartOutlined,
    SearchOutlined,
    SettingOutlined,
    BookOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';

// import { crew, leader, root } from '@/constants/privilege';

export type SubMenuOption = {
    title: string;
    path: string;
};

export type MenuOption = {
    title: string;
    icon: any;
    path: string;
    children?: SubMenuOption[];
};

// 各种页面
const HomePage: MenuOption = { title: '首页', icon: HomeOutlined, path: '/' };

const PatientsPage: MenuOption = {
    title: '书本',
    icon: PieChartOutlined,
    path: '/books',
};

const AuthorsPage: MenuOption = {
    title: '作者',
    icon: UserOutlined,
    path: '/authors',
};

const SearchPage: MenuOption = {
    title: '搜索',
    icon: SearchOutlined,
    path: '/search',
};

const GlobalSettingPage: MenuOption = {
    title: '全局设置',
    icon: SettingOutlined,
    path: '/settings',
};

const DictsPage: MenuOption = {
    title: '字典',
    icon: BookOutlined,
    path: '/dicts',
};

const UsersPage: MenuOption = {
    title: '用户',
    icon: UsergroupAddOutlined,
    path: '/users',
};

const MenusInitState = [HomePage, PatientsPage];

export function get_menus(): MenuOption[] {
    // switch (privilege) {
    //     case crew:
    //         return MenusInitState;
    //     case leader:
    //     case root:
    //         return [HomePage, PatientsPage, DictsPage, UsersPage];
    //     default:
    //         throw new Error(`${privilege} 未定义角色`);
    // }
    return [HomePage, PatientsPage, DictsPage, UsersPage];
}

// export interface IUser extends IKey {
//     email: string;
//     password: string;
//     name: string;
//     role: number;
//     privilege: number;
//     settings: Record<string, any>;
// }

export const zeroUser: IUser = {
    id: 0,
    version: 0,
    name: '',
    email: '',
    password: '',
    role: 0,
    privilege: 0,
    settings: {},
    created_at: undefined,
    updated_at: undefined,
};

export interface IUsersState {
    data: IUser[];
    total: number;
    pess_locktables: Set<string>;
    loginer: {
        user: IUser;
        token: string;
    };
}

const INIT_STATE: IUsersState = {
    data: [],
    total: 0,
    pess_locktables: new Set(),
    loginer: {
        user: zeroUser,
        token: '',
    },
};

export default {
    namespace: 'users',
    state: INIT_STATE,
    reducers: {
        fetch_success: (state = INIT_STATE, action: IAction) => {
            console.log('users fetch success =>', action);
            // 如果返回没有payload, 就表示所有数据不变
            if (!action.payload) {
                return state;
            }

            const { list, total } = action.payload;
            return {
                ...state,
                data: list,
                total,
            };
        },
        update_success: (state = INIT_STATE, action: IAction) => {
            console.log('users update success =>', action);
            const { tabler } = action.payload;
            const index = state.data.findIndex((user) => user.id === tabler.id);
            if (index === -1) {
                return {
                    ...state,
                    loginer: { ...state.loginer, user: tabler },
                };
            }
            return {
                ...state,
                data: [
                    ...state.data.slice(0, index),
                    tabler,
                    ...state.data.slice(index + 1),
                ],
                loginer: { ...state.loginer, user: tabler },
            };
        },
        login_success: (state = INIT_STATE, action: IAction) => {
            console.log('users login success =>', action);
            const { token, user, pess_lock } = action.payload as {
                user: IUser;
                token: string;
                pess_lock: string[];
            };

            console.log('pess_lock', pess_lock, new Set(pess_lock));
            return {
                ...state,
                pess_locktables: new Set(pess_lock),
                loginer: { user, token },
            };
        },
        logout_success: (state = INIT_STATE, action: IAction) => {
            console.log('user logout success', action);
            return {
                ...state,
                user: zeroUser,
                token: '',
            };
        },
    },
};
