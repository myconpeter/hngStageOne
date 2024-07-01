import axios from 'axios';
import os from 'node:os';

const getPublicIpAddress = async () => {
	try {
		const response = await axios.get('https://api.ipify.org?format=json');
		return response.data.ip;
	} catch (error) {
		console.error('Error fetching public IP address:', error.message);
		return '127.0.0.1'; // fallback to localhost
	}
};

const getLocationFromIp = async (ip) => {
	try {
		const response = await axios.get(`http://ip-api.com/json/${ip}`);
		if (response.data.status === 'fail') {
			throw new Error('Location not found');
		}
		return {
			city: response.data.city,
			lat: response.data.lat,
			lon: response.data.lon,
		};
	} catch (error) {
		console.error('Error fetching location:', error.message);
		return null;
	}
};

// Fallback function to get more accurate location using multiple sources
const getAccurateLocation = async (ip) => {
	let location = await getLocationFromIp(ip);
	if (!location) {
		try {
			const response = await axios.get(`https://ipinfo.io/${ip}/json`);
			const [lat, lon] = response.data.loc.split(',');
			location = {
				city: response.data.city,
				lat: parseFloat(lat),
				lon: parseFloat(lon),
			};
		} catch (error) {
			console.error(
				'Error fetching location from fallback service:',
				error.message
			);
		}
	}
	return location || { city: 'Unknown', lat: 0, lon: 0 };
};

const helloController = async (req, res) => {
	let visitorName = req.query.visitor_name || 'Guest';

	if (visitorName.startsWith('"') && visitorName.endsWith('"')) {
		visitorName = visitorName.slice(1, -1);
	}

	try {
		// Get the public IP address
		const publicIp = await getPublicIpAddress();

		// Get location based on IP address
		const location = await getAccurateLocation(publicIp);

		if (!location.city || location.city === 'Unknown') {
			throw new Error('Location not found for the given IP address');
		}

		const { lat, lon } = location;

		const weatherResponse = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1c5d9fc29bf3fc7b4a88266701ca1af5&units=metric`
		);
		const temperature = Math.round(weatherResponse.data.main.temp);

		res.json({
			client_ip: publicIp,
			location: location.city,
			greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location.city}`,
		});
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
};

export default helloController;
