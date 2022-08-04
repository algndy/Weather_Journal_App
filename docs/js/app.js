//Global Variables
const baseURL ="https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = ",us&appid=188edc895e774e8cc5bd65a8f853c557&units=";
const unit ="metric";
const btn = document.querySelector('#generate');
let zipCode;
let userFeelings;


//Event listener for add active class to the form and weather info to make it responsive when click on Generate button
btn.addEventListener('click',(e)=>{
    e.preventDefault();
    
    const myForm = document.querySelector('#container form');
    const myinfo = document.querySelector('#info');
    
    if(outerWidth<=1212)
    {
        myForm.classList.remove("active-big-form");
        myinfo.classList.remove("active-big-info");
        myForm.classList.add("active-small-form");
        myinfo.classList.add("active-small-info"); 
    }
    else if(outerWidth>1212)
    {
    myForm.classList.remove("active-small-form");
    myinfo.classList.remove("active-small-info");
    myForm.classList.add("active-big-form");
    myinfo.classList.add("active-big-info");
    }
  myinfo.scrollIntoView({behavior:"smooth",block:"center"});
   
});


/*
Event listener for 
fetch Weather data from WeatherOpen website 
then post it to  hte server 
then show it on our website 
*/
btn.addEventListener('click',performAction)

function performAction(e)
{
    e.preventDefault();
    zipCode = document.querySelector('#zip').value;
    userFeelings = document.querySelector('#feelings').value;
    const fullURI = `${baseURL}${zipCode}${apiKey}${unit}`
    
    getData(fullURI)
    .then(data=>{
        postData('/',data); 
        updateUI();
    });

    
}

/*
fetch Weather data then
Manipulate data to obtain the required data then
return required data to use it in the next function (postData) 
*/ 
async function getData(fullURI)
{
    const data = await fetch(fullURI);
    
    try
    {
        
        const newData = await data.json();
        
        if(newData.cod != 200)
        {
            document.querySelector('#info').style.cssText = "display:flex;justify-content:center"
            document.querySelector('#info').innerHTML =
               `<div style='font-size:33px;color:red;'>${newData.message}!!<div>
                <div style='font-size:20px;color:red;'>Please Enter United States Zip Code`;
            throw newData.message;
        }
        
        console.log(newData);
        const date = new Date();
        const totalData ={
            feelings: userFeelings,
            date: date.toDateString(),
            cod: newData.cod,
            temp: newData.main.temp,
            city: newData.name,
            country: newData.sys.country,
            weather: newData.weather[0].main,
            imgSrc : `http://openweathermap.org/img/w/${newData.weather[0].icon}.png`,
        }
        return totalData
    }
    catch(e)
    {
        console.log("Error during get data: ",e);
    }
}


//Post fetched data from getData function
async function postData(url="",data={})
{
    const option = {
        method:"POST",
        headers:{
            'Content-Type':"application/json",
        },
        body:JSON.stringify(data)
    };
    
    const res = await fetch(url , option);
    
    try
    {
        const newData = await res.json();
        console.log(newData);
        return newData
    }
    catch(e)
    {
        console.log("Error during post data: ",e);
    }

}


//Update UI and show data at front-end
async function updateUI()
{
    const data = await fetch('/all')
    
    
    try
    {
        const finalData = await data.json();
        if(finalData.cod == 200)
        {
            document.querySelector('#info').innerHTML = `
            <div id="all-info-without-feel">
                <div class="weather-info" id="img-temp-weather"></div>
                <div class="weather-info" id="country-city-date"></div>
            </div>
            <div class="weather-info" id="feel"></div>`
        document.querySelector('#feel').innerHTML =`<div>${finalData.feelings}</div>`;
        
        document.querySelector('#img-temp-weather').innerHTML =
            `<div><img src="${finalData.imgSrc}"></div>
            <div><span>${finalData.weather}: ${finalData.temp}&deg;C</span></div>`;
        
        document.querySelector('#country-city-date').innerHTML =
            `<div><p>${finalData.country}, ${finalData.city}</p></div>
            <div><p>${finalData.date}</p></div>`;
        }
    }
    catch(e)
    {
        console.log("Error during update UI: ",e)
    }
}
