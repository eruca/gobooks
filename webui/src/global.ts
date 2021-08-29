import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

import zhcn from 'dayjs/locale/zh-cn';
import 'normalize.css';
import 'antd/dist/antd.css';

dayjs.extend(relativeTime);
dayjs.locale(zhcn);
