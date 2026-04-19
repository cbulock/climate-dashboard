import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const isPoolSeason = (date = dayjs()) => {
	const currentDate = dayjs(date);
	const springOpen = dayjs(currentDate)
		.year(currentDate.year())
		.month(4)
		.date(15);
	const fallClose = dayjs(currentDate)
		.year(currentDate.year())
		.month(8)
		.date(15);

	return currentDate.isBetween(springOpen, fallClose);
};

export default isPoolSeason;
