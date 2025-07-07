import dayjs from 'dayjs';
import 'dayjs/locale/id'; 
import weekday from 'dayjs/plugin/weekday';

dayjs.locale('id');
dayjs.extend(weekday);

export default dayjs;