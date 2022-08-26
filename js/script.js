


const headerSubtitle = document.querySelector('.header__subtitle');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let currentDay = {
	name: '', 
	index: 0,
};

function getDateString() {

	const now = new Date();
	const dayAbbr = String(now).split('').splice(0, 3).join('');
	
	const day = days.filter((day) => {
		return (day.includes(dayAbbr) === true);
	})[0];

	currentDay.name = day;
	currentDay.index = days.indexOf(day);
	// currentDay.name = 'Friday';
	// currentDay.index = 5;

	const date = String(now.getDate());
	const month = months[now.getMonth()];
	const year = String(now.getFullYear());

	return `${day} ${date}, ${month} ${year}`;

}

headerSubtitle.textContent = getDateString();









const getCurrentIndex = (indexOfFirstDay, indexOfElement) => {
	const daysInWeek = days.length;
	return (indexOfFirstDay + indexOfElement < daysInWeek) ? indexOfFirstDay + indexOfElement : (indexOfFirstDay + indexOfElement) - daysInWeek;
}

const forecastItems = document.querySelectorAll('.forecast__item');

forecastItems.forEach((item, indexOfElement) => {
	const title = item.querySelector('.item-forecast__title');	
	title.textContent = days[getCurrentIndex(currentDay.index, indexOfElement)];
});

const graphDays = document.querySelectorAll('.graph__day');
graphDays.forEach((item, indexOfElement) => {
	item.textContent = days[getCurrentIndex(currentDay.index, indexOfElement)].slice(0, 3);
});














const searchForm = document.querySelector('.search__form');
const searchInput = document.querySelector('.search__input');

const API_KEY = '9b9e3491c86642e530f10751991f4250';

searchForm.addEventListener('submit', (event) => {

	event.preventDefault();

	const formData = new FormData(event.target);
	const cityName = formData.get('search');

	if (cityName === '') { return; } 

	fetchData(cityName, API_KEY);

	searchInput.value = '';

});


function fetchData(cityName, API_KEY) {

	const imageTitle = document.querySelector('.weather__image-title');
	const imageSubtitle = document.querySelector('.weather__image-subtitle');
	const imageTemp = document.querySelector('.weather__image-temp');

	const sunriseTitle = document.querySelector('.sunrise__time--sunrise');
	const sunsetTitle = document.querySelector('.sunrise__time--sunset');

	// - Logic

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)

    	.then((response) => response.json())
    	.then((currentData) => {

    		setTodayData(currentData);

    		imageTitle.textContent = currentData.name;
    		imageTemp.innerHTML = Math.round(currentData.main.temp - 273) + '&deg';
    		console.log(currentData);

    		const sunriseTime = currentData.sys.sunrise;
    		const sunsetTime = currentData.sys.sunset;
    		const timezone = currentData.timezone;

    		sunriseTitle.textContent = window.moment.utc(sunriseTime, 'X').add(timezone, 'seconds').format('HH:mm a');
    		sunsetTitle.textContent = window.moment.utc(sunsetTime, 'X').add(timezone, 'seconds').format('HH:mm a');


    		const { lon, lat } = currentData.coord;

    		fetchAirQuilityIndex(lat, lon, API_KEY);

    		fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${API_KEY}`)

    			.then((response) => response.json())
    			.then((forecastData) => {

    				console.log(forecastData);

    				imageSubtitle.textContent = forecastData.timezone.split('/')[0];

    				const sevenDaysForecast = [forecastData.current, ...forecastData.daily].slice(0, 7);

    				forecastItems.forEach((item, index) => {

    					// const day = item.querySelector('.item-forecast__title');
    					const description = item.querySelector('.item-forecast__subtitle');
    					const icon = item.querySelector('.item-forecast__image');

    					const wind = item.querySelector('.item-forecast__wind-title');
    					const humidity = item.querySelector('.item-forecast__rain-title');
    					const temp = item.querySelector('.item-forecast__temp');

    					const currentDay = sevenDaysForecast[index];

    					// Day

    					description.textContent = currentDay.weather[0].main;
    					icon.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png`);

    					wind.textContent = `${currentDay.wind_speed} km/h`;
    					humidity.textContent = `${currentDay.humidity}%`;

    					const currentTemp = (index === 0) ? currentDay.temp : currentDay.temp.day;
    					temp.innerHTML = Math.round(currentTemp - 273) + '&deg';

    				});



    				const arrOfTemps = sevenDaysForecast
    					.map((item, index) => {
    						return (index === 0) ? item.temp : item.temp.day;
    					})
    					.map((temp) => {
    						return Math.round(temp - 273);
    					});

    			

					buildGraph(arrOfTemps, canvas, points, lines)();
					window.addEventListener('resize', buildGraph(arrOfTemps, canvas, points, lines));


    			})

    			.catch((error) => error);

    	})

    	.catch((error) => error);

}

const defaultCity = 'Moscow';
fetchData(defaultCity, API_KEY);


function setTodayData(data) {

	const dayTitle = document.querySelector('.today-forecast__day');
	const timeTitle = document.querySelector('.today-forecast__time');

	const tempTitle = document.querySelector('.today-forecast__temp');
	const iconImage = document.querySelector('.today-forecast__icon img');
	const descriptionTitle = document.querySelector('.today-forecast__description');
	const feelsTitle = document.querySelector('.today-forecast__feels-like-definition');

	const windTitle = document.querySelector('.today-forecast__wind-title');
	const rainTitle = document.querySelector('.today-forecast__rain-title');
	const pressureTitle = document.querySelector('.today-forecast__pressure-title');
	
	const maxTempTitle = document.querySelector('.today-forecast__max-temp-definition');	
	const minTempTitle = document.querySelector('.today-forecast__min-temp-definition');	

	// const date = new Date();
	// dayTitle.textContent = date.get
	// timeTitle.textContent

	tempTitle.innerHTML = '+' + Math.round(data.main.temp - 273) + '&deg' + 'C';
	iconImage.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
	descriptionTitle.textContent = data.weather[0].description;
	feelsTitle.innerHTML = Math.round(data.main.feels_like - 273) + '&deg' + 'C';

	windTitle.textContent = data.wind.speed + 'km/h';
	rainTitle.textContent = data.main.humidity + '%';
	pressureTitle.textContent = data.main.pressure + 'mm.Hg.';

	maxTempTitle.innerHTML = Math.round(data.main.temp_max - 273) + '&deg' + 'C';
	minTempTitle.innerHTML = Math.round(data.main.temp_min - 273) + '&deg' + 'C';

}




const itemsTemp = document.querySelectorAll('.item-forecast__temp');
const degreeButtons = document.querySelectorAll('.degree-icon');

degreeButtons.forEach((button) => {
	button.addEventListener('click', (event) => {
		button.closest('.forecast__degrees').querySelectorAll('.degree-icon').forEach((item) => {
			item.classList.remove('degree-icon--active');
		});
		button.classList.toggle('degree-icon--active');
	});
});




const forecastHeaderButtons = Array.from(document.querySelector('.forecast__label').children);
let activeButton = document.querySelector('.forecast__week');

forecastHeaderButtons.forEach((button) => {
	button.addEventListener('click', (event) => {
		Array.from(button.closest('.forecast__label').children).forEach((item) => {
			item.classList.remove('forecast-title--active');
		});
		button.classList.toggle('forecast-title--active');
		if (button.classList.contains('forecast-title--active')) {
			activeButton = button;
		}
		displayWeather(activeButton);
	});
});

function displayWeather(button) {

	const forecastBody = document.querySelector('.forecast__body');
	Array.from(forecastBody.children).forEach((item) => {
		item.classList.add('none');
	});

	const today = forecastBody.querySelector('.forecast__today-content');
	const week = forecastBody.querySelector('.forecast__week-content');

	if (button.classList.contains('forecast__week')) {
		week.classList.remove('none');
	} else {
		today.classList.remove('none');
	}
}

displayWeather(activeButton);








const min = (arr) => {

	if (arr.length === 0) { return };

	let minValue = arr[0];
	return arr.reduce((acc, item) => {
		if (item < acc) {
			acc = item;
		}
		return acc;
	}, minValue);
}

const max = (arr) => {

	if (arr.length === 0) { return };

	let maxValue = arr[0];
	return arr.reduce((acc, item) => {
		if (item > acc) {
			acc = item;
		}
		return acc;
	}, maxValue);
}



const buildGraph = (arr, canvas, points, lines) => {


	return function() {

		const pointSide = points[0].clientHeight;
		const numberOfPixelsPerOneDegree = (canvas.clientHeight - pointSide) / (max(arr) - min(arr)); 
		const offsetX = (canvas.clientWidth - pointSide) / 6;

		const pointsModel = arr.map((item, index) => {
			const y = Math.round(numberOfPixelsPerOneDegree * (item - min(arr)));
			const x = index * offsetX;
			return new Point(x, y);
		});

		points.forEach((point, index) => {
			point.style.bottom = `${pointsModel[index].getY()}px`;
			point.style.left = `${pointsModel[index].getX()}px`;
		});

		const segmentsModel = pointsModel.map((point, index) => {
			if (index === pointsModel.length - 1) { return; }
			const startPoint = new Point(point.getX(), point.getY());
			const endPoint = new Point(pointsModel[index + 1].getX(), pointsModel[index + 1].getY());
			return new Segment(startPoint, endPoint);
		}).slice(0, -1);

		lines.forEach((line, index) => {
			line.style.bottom = `${segmentsModel[index].getStartPoint().getY()}px`;
			line.style.left = `${segmentsModel[index].getStartPoint().getX()}px`;
			line.style.height = `${segmentsModel[index].getLength()}px`;
			line.style.transform = `rotate(${segmentsModel[index].getAngle()}deg)`;
		});

	}

}

// window.onresize = buildGraph;
const canvas = document.querySelector('.graph__canvas');
const points = document.querySelectorAll('.point');
const lines = document.querySelectorAll('.line');





// Air index API

function fetchAirQuilityIndex(latitude, longitude, API_KEY) {

	const airContent = document.querySelector('.air__content');
	const airTitle = document.querySelector('.air__title');
	const airDefinition = document.querySelector('.air__definition');

    fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)

    	.then((response) => response.json())
    	.then((data) => {
    		
    		const aqi = data.list[0].main.aqi;
    		const aqiModel = getAqiModel(aqi);

    		airDefinition.textContent = `${aqi}*`;
    		airTitle.textContent = aqiModel.title;
    		airContent.style.backgroundColor = aqiModel.color;

    	})

    	.catch((error) => error);


}

function getAqiModel(aqi) {
	switch (aqi) {
		case 1:
			return {
				title: 'Good',
				color: 'rgb(253, 250, 240)',
			}
			break;
		case 2: 
			return {
				title: 'Fair',
				color: 'rgb(252, 235, 223)',
			}
			break;
		case 3:
			return {
				title: 'Moderate',
				color: 'rgb(254, 220, 122)',
			}
			break;
		case 4:
			return {
				title: 'Unhealthy',
				color: 'rgb(253, 148, 111)',
			}
			break;
		case 5: 
			return {
				title: 'Dangerous',
				color: 'rgb(240, 108, 83)',
			}
			break;
		default: break;
	}

}

































