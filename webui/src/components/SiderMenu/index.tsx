import React, { useState, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useHistory } from 'umi';
import { useSelector } from 'react-redux';

import RootState from '@/models';
import { get_menus, MenuOption } from '@/models/users/users';

function build_menu(options: MenuOption[]): React.ReactNode[] {
    return options.map((opt, i) => {
        if (!opt.children) {
            return (
                <Menu.Item key={opt.path} icon={React.createElement(opt.icon)}>
                    {opt.title}
                </Menu.Item>
            );
        }
        return (
            <Menu.SubMenu
                key={`sub${i}`}
                title={opt.title}
                icon={React.createElement(opt.icon)}
            >
                {opt.children.map((c) => (
                    <Menu.Item key={opt.path + c.path}>{c.title}</Menu.Item>
                ))}
            </Menu.SubMenu>
        );
    });
}

export default function SideMenu() {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const history = useHistory();
    const { privilege } = useSelector(
        (states: RootState) => states.users.loginer.user,
    );
    const menus = useMemo(() => get_menus(), [privilege]);

    return (
        <Layout.Sider
            collapsible={true}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
                backgroundColor: 'white',
            }}
        >
            <Menu
                onClick={(e) => history.push(e.key.toString())}
                defaultSelectedKeys={[pathname]}
                mode="inline"
                style={{ backgroundColor: 'white', position: 'sticky', top: 0 }}
            >
                {build_menu(menus)}
            </Menu>
        </Layout.Sider>
    );
}
