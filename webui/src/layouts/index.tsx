import { IRouteComponentProps } from 'umi';

import Blank from './blank';
import Frame from './frame';

export default function (props: IRouteComponentProps) {
    if (
        props.location.pathname === '/login' ||
        props.location.pathname === '/register'
    ) {
        return <Blank>{props.children}</Blank>;
    }

    console.log('into frame');
    return <Frame props={props}>{props.children}</Frame>;
}
