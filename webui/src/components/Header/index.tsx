import { useMemo } from 'react';
import { Avatar, Tooltip, Dropdown, Menu } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useHistory, useModel } from 'umi';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.less';
import logoSrc from './wzhosp.png';
import { users_logout } from '@/types/users';
import RootState from '@/models';

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <a href="/">
                    <img
                        src={logoSrc}
                        style={{ width: '353px', height: '70px' }}
                    />
                </a>
            </div>
            <LogoDropDown />
        </div>
    );
}

function LogoDropDown() {
    const history = useHistory();

    const dispatch = useDispatch();
    const {
        user: { id, name },
        token,
    } = useSelector((states: RootState) => states.users.loginer);
    const { setDrawerComponent, setVisible, setEditId } = useModel('useDrawer');

    const menu = useMemo(
        () => (
            <Menu
                onClick={({ key }) => {
                    switch (key) {
                        case 'logout':
                            dispatch(users_logout({ id, token }));
                            break;
                        case 'sets':
                            setDrawerComponent({
                                title: '设置',
                                component: 'SetsForm',
                                width: 480,
                                props: {},
                            });
                            // dispatch(
                            //     users_editon({ id, token }, () => {
                            //         setVisible(true);
                            //         setEditId(id);
                            //     }),
                            // );
                            break;
                    }
                }}
            >
                <Menu.Item key="sets">
                    <SettingOutlined />
                    我的信息
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <LogoutOutlined />
                    登出
                </Menu.Item>
            </Menu>
        ),
        [dispatch],
    );

    return name ? (
        <div className={styles.avatar}>
            <Dropdown overlay={menu}>
                <Avatar size="large">{name}</Avatar>
            </Dropdown>
        </div>
    ) : (
        <div className={styles.avatar} onClick={() => history.push('/login')}>
            <Tooltip title="登录">
                <Avatar size="large" icon={<UserOutlined />} />
            </Tooltip>
        </div>
    );
}
