import { useRef, useMemo } from 'react';
import { Layout, Drawer } from 'antd';
import { useModel, IRouteComponentProps } from 'umi';
import { useSelector, useDispatch } from 'react-redux';

import hub from '@/core';
import Header from '@/components/Header';
import SiderMenu from '@/components/SiderMenu';
import styles from './frame.less';
import { defaultDrawerWidth, version } from '@/settings';
import RootState from '@/models';

export default function (props: IRouteComponentProps) {
    return (
        <Layout className={styles.page}>
            <Header />
            <Layout>
                <SiderMenu />
                <Layout.Content className={styles.body}>
                    <div className={styles.main}>{props.children}</div>
                    <Layout.Footer className={styles.footer}>
                        {`@重症医学科 - 版本:${version}`}
                    </Layout.Footer>
                </Layout.Content>
            </Layout>
            <DrawerComponent />
        </Layout>
    );
}

function DrawerComponent() {
    const dispatch = useDispatch();

    const { drawerComponent, visible, onClose, closable, setClosable } =
        useModel('useDrawer');
    const { token } = useSelector((states: RootState) => states.users.loginer);
    const ref = useRef();
    console.log('drawerComponent', drawerComponent.component);

    let component = useMemo(
        () =>
            hub.query(drawerComponent.component).unwrapOr(false)
                ? hub
                      .access(drawerComponent.component, {
                          ref,
                          ...drawerComponent.props,
                      })
                      .unwrapOr(null)
                : hub
                      .access(drawerComponent.component, drawerComponent.props)
                      .unwrapOr(null),
        [ref, hub, drawerComponent],
    );

    return visible ? (
        <Drawer
            title={drawerComponent.title}
            visible={visible}
            onClose={() => {
                onClose();
                closable.close && closable.close();
                setClosable({});
            }}
            destroyOnClose={true}
            width={drawerComponent.width || defaultDrawerWidth}
            afterVisibleChange={(visible) => {
                // @ts-ignore
                visible && ref.current && ref.current.focus();
            }}
            children={component}
        />
    ) : null;
}
