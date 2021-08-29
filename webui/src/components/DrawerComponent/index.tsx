import { useRef, useCallback, useMemo, Dispatch } from 'react';
import { Layout, Drawer } from 'antd';
import { useModel, IRouteComponentProps } from 'umi';
import { useSelector, useDispatch } from 'react-redux';

import hub from '@/core';
import Header from '@/components/Header';
import SiderMenu from '@/components/SiderMenu';
import styles from './frame.less';
import { defaultDrawerWidth } from '@/settings';
import RootState from '@/models';

interface IDrawerComponent {
    DrawerOnClose: (dispatch: Dispatch<any>) => void;
}

function DrawerComponent({ DrawerOnClose }: IDrawerComponent) {
    const dispatch = useDispatch();

    const ref = useRef();

    const { visible, onClose, drawerComponent, editId } = useModel('useDrawer');
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

    // const onClose2 = useCallback(() => {
    //     onClose();
    //     if (!editId) {
    //         return;
    //     }
    //     console.log(
    //         'drawerComponent',
    //         drawerComponent.component,
    //         'editId',
    //         editId,
    //     );
    //     switch (drawerComponent.component) {
    //         case 'UsersNewForm':
    //             dispatch(users_editoff({ id: editId, token }));
    //             break;
    //         case 'DictsNewForm':
    //             dispatch(dicts_editoff({ id: editId, token }));
    //             break;
    //         case 'PatientsNewForm':
    //             dispatch(patients_editoff({ id: editId, token }));
    //             break;
    //         case 'SetsForm':
    //             dispatch(users_editoff({ id: editId, token }));
    //             break;
    //     }
    // }, [drawerComponent.component, editId, token, onClose]);

    return visible ? (
        <Drawer
            title={drawerComponent.title}
            visible={visible}
            onClose={() => {
                onClose();
                DrawerOnClose(dispatch);
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
