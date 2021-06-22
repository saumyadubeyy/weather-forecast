import React, {useState} from 'react'
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
    let [err, setErr] = useState(false)
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
            if(!cityName){
                setErr(true)
            } else{
                setErr(false)
            }
            if(unit==="imperial"){
                setShowUnit("F")
            } else{
                setShowUnit("C")
            }
        } catch(error){
            console.log("YOU HAVE ENTERED AN INVALID CITY")
        }            
    }

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
        <div className="main">  
            <h2>Weather Forecast</h2>        
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
            {
                    !cityName? (
                        <h4 className= {err? "blink" : "noBlink"}>Please enter a valid city name</h4>
                    ) : (
                        <h4 className="date">{date}, {time}</h4>
                    )
                } 
            <div className="data">
            {
                !cityName? (
                    <h3>Your data will be displayed here</h3>
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
                            <h4 className="margin size">Feels like {data.feels_like} °{showUnit}</h4>
                        </div>
                        <div className="minmax">
                            <h4 className="margin">Min temperature: {data.temp_min} °{showUnit} || Max temperature: {data.temp_max} °{showUnit}</h4>
                        </div>
                        <div>
                            <h3 className="margin">Sunrise: {time_sunrise} || Sunset: {time_sunset}</h3>
                        </div>             
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Weather
