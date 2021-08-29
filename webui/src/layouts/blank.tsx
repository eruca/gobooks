import { IRouteComponentProps } from 'umi';
import { Layout } from 'antd';
import Header from '@/components/Header';

import styles from './blank.less';

export default function (props: IRouteComponentProps) {
    return (
        <Layout className={styles.page}>
            <Header name="" />
            <div className={styles.blank_page}>{props.children}</div>
        </Layout>
    );
}
