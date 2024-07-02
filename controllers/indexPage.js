import axios from 'axios';

const helloController = async (req, res) => {
	let visitorName = req.query.visitor_name || 'Guest';

	if (visitorName.startsWith('"') && visitorName.endsWith('"')) {
		visitorName = visitorName.slice(1, -1);
	}

	const clientIP =
		req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const ipAddress = clientIP.split(',')[0];

	try {
		// Get the public IP address
		const location = await axios.get(`http://ip-api.com/json/${ipAddress}`);
		const city = location.data.city || 'New York';

		// Get location based on IP address
		const openApi = process.env.OPEN_WEATHER_API;

		const weather = await axios.get(
			`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openApi}`
		);
		const temp = weather.data.main.temp;

		res.json({
			client_ip: ipAddress,
			location: city,
			greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsius in ${city}`,
		});
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
};

export default helloController;
