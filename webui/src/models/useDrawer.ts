import { useState, useCallback } from 'react';

export interface IDrawerComponent<T> {
    title: string;
    component: string;
    width?: number;
    props: Partial<T>;
}

export interface DrawerComponent {
    title: string;
    component: string;
    width?: number;
    props: any;
}

export interface IClosable {
    close?: () => void;
}

export default function useDrawer() {
    const [visible, setVisible] = useState<boolean>(false);
    const onClose = useCallback(() => setVisible(false), [setVisible]);

    const [closable, setClosable] = useState<IClosable>({});

    const [drawerComponent, setDrawerComponent] = useState<DrawerComponent>({
        title: '',
        component: '',
        width: 0,
        props: {},
    });
    const onOpen = useCallback(
        (comp: DrawerComponent) => {
            setVisible(true);
            setDrawerComponent(comp);
        },
        [setVisible, setDrawerComponent],
    );

    return {
        drawerComponent,
        setDrawerComponent,

        visible,
        setVisible,

        onOpen,
        onClose,

        closable,
        setClosable,
    };
}
