import axios from 'axios';

const helloController = async (req, res) => {
	let visitorName = req.query.visitor_name || 'Guest';

	if (visitorName.startsWith('"') && visitorName.endsWith('"')) {
		visitorName = visitorName.slice(1, -1);
	}

	try {
		const ipResponse = await axios.get('https://api.ipify.org?format=json');
		const ip = ipResponse.data.ip;

		const locationResponse = await axios.get(
			`http://ip-api.com/json/${ip}`
		);

		const location = locationResponse.data.city;
		const lat = locationResponse.data.lat;
		const lon = locationResponse.data.lon;

		const weatherResponse = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1c5d9fc29bf3fc7b4a88266701ca1af5`
		);
		const temperature = Math.round(weatherResponse.data.main.temp - 273);

		res.json({
			client_ip: ip,
			location: location,
			greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default helloController;
