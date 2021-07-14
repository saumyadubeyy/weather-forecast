import React, {useState, useEffect} from 'react'
import moment from 'moment'
import './Weather.css'

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY

const Weather = () => {

    const [search, setSearch] = useState('')
    const [data, setData] = useState('')
    const [unit, setUnit] = useState('imperial')
    const [cityName, setCityName] = useState('')
    const [weather, setWeather] = useState('')
    const [sys, setSys] = useState('')
    const [err, setErr] = useState(false)
    let [showUnit, setShowUnit] = useState('')

    

    const fetchData = async (e) => {
        e.preventDefault();
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=${unit}&appid=${API_KEY}`
            const response = await fetch(url)
            const data = await response.json()
            setCityName(data.name)
            setWeather(data.weather[0])
            setSys(data.sys)
            setData(data.main)             
            if(unit==="imperial"){
                setShowUnit("F")
            } else{
                setShowUnit("C")
            }
        } catch(error){
            setErr(true)
        }            
    }

    const [size, setSize] = useState(window.innerWidth);
    const checkSize = () => {
        setSize(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", checkSize);
        return () => {
        window.removeEventListener("resize", checkSize);
        };
    });


    const sunrise = new Date(sys.sunrise *1000) ;
    const time_sunrise =  sunrise.toLocaleTimeString({},
        {timeZone:'Asia/Kolkata',hour12:true,hour:'numeric',minute:'numeric'}
      );
    
    const sunset = new Date(sys.sunset *1000) ;
    const time_sunset =  sunset.toLocaleTimeString({},
        {timeZone:'Asia/Kolkata',hour12:true,hour:'numeric',minute:'numeric'}
      );

    
    const date = moment(new Date()).format('DD MMMM YYYY')
    const time = moment().format("h:mm A")
    
    

    return (
        <div >  
            <h2>Weather Forecast</h2>        
            <div className="main">
                <form onSubmit={fetchData}>
                    <div>
                        <input 
                            type="search"
                            placeholder="Enter City"
                            maxLength="20"
                            style={{textTransform: 'capitalize'}}
                            onChange={(e) =>setSearch(e.target.value) }
                        />
                    </div>
                    <label className="radio"> 
                        <input 
                            type="radio"
                            name="units"
                            checked={unit === "imperial"}
                            value="imperial"
                            onChange={(e) => setUnit(e.target.value)}
                        /> Fahrenheit
                    </label>
                    <label className="radio">
                        <input
                            type="radio"
                            name="units"
                            checked={unit === "metric"}
                            value="metric"
                            onChange={(e) => setUnit(e.target.value)}
                            />
                        Celcius
                    </label>
                        <button type="submit" className="btn">Get Forecast</button>             
                </form>
            </div>
            
                            
            <div className="data">
                <h4 className="date">{date}, {time}</h4>
            {
                !cityName? (
                    <h3 className= { err ? "blink" : ""} style={{textAlign: "center"}}>Enter valid city name</h3>
                ):
                (
                    <div className="forecast clear">
                        <h2 className="heading">{cityName}</h2>
                        <div className="icon" >
                            <img src={`https://openweathermap.org/img/w/${weather.icon}.png`} alt="icon"/> 
                            <h3 className="margin size" style={{textTransform: 'capitalize'}}>{weather.description}</h3>
                        </div>
                        <div className="temp">
                            <h3 className="margin mainTemp">{data.temp} °{showUnit}</h3>
                            <h4 className="margin size screen">Feels like {data.feels_like} °{showUnit}</h4>
                        </div>
                        <div className="minmax">
                            <h4 className="margin">Min temperature: {data.temp_min} °{showUnit}</h4>
                            <h4 className="margin">Max temperature: {data.temp_max} °{showUnit}</h4>
                        </div>
                        <div>
                            <h3 className="margin">Sunrise: {time_sunrise} <span> {size <= 420 ? <br /> : ""}Sunset: {time_sunset}</span></h3>
                        </div>             
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Weather
