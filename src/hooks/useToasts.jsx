import { useContext, useState } from 'react';

import { toast } from 'react-toastify';

import { EntitiesContext } from '../context/Entities';

const useToasts = () => {
	const { entities } = useContext(EntitiesContext);
	const [activeAlerts, setActiveAlerts] = useState([]);

	const alerts = entities['switch.alerts']?.attributes?.data;

	const newActiveAlerts = alerts?.map((alert) => alert.name);

	const alertsToClose = activeAlerts?.filter(
		(alert) => !newActiveAlerts?.find((a) => a === alert),
	);

	const alertsToOpen = newActiveAlerts?.filter(
		(alert) => !activeAlerts?.find((a) => a === alert),
	);

	alertsToClose?.forEach((alertId) => {
		toast.dismiss(alertId);
	});

	alertsToOpen?.forEach((alertId) => {
		const alert = alerts.find((a) => a.name === alertId);
		toast(alert.description, {
			toastId: alert.name,
			style: {
				color: `rgb(${alert.rgb_color[0]}, ${alert.rgb_color[1]}, ${alert.rgb_color[2]})`,
			},
		});
	});

	if (JSON.stringify(activeAlerts) !== JSON.stringify(newActiveAlerts))
		setActiveAlerts(newActiveAlerts);
};

export default useToasts;
