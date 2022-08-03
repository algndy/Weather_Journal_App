const baseURL ="https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = ",us&appid=188edc895e774e8cc5bd65a8f853c557&units=";
const unit ="metric";
const btn = document.querySelector('#generate');
let zipCode;
let userFeelings;



btn.addEventListener('click',(e)=>{
    e.preventDefault();
    
    const myForm = document.querySelector('#container form');
    const myinfo = document.querySelector('#info');
    //  myForm.style.cssText+="position:relative;transition:right 1000ms;right:5%";
    //  myinfo.style.cssText = ";opacity:1;transition:opacity 2000ms, width 1500ms, height 1500ms;width:500px;height:243px";
    
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

async function getData(fullURI)
{
    const data = await fetch(fullURI);
    
    try
    {
        const newData = await data.json();
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

async function updateUI()
{
    const data = await fetch('/all')
    
    try
    {
        const finalData = await data.json();
        let feelings = document.querySelector('#feel').innerHTML =`<div>${finalData.feelings}</div>`;
        
        let temp = document.querySelector('#img-temp-weather').innerHTML =
            `<div><img src="${finalData.imgSrc}"></div>
            <div><span>${finalData.weather}: ${finalData.temp}&deg;C</span></div>`;
        
        let country = document.querySelector('#country-city-date').innerHTML =
            `<div><p>${finalData.country}, ${finalData.city}</p></div>
            <div><p>${finalData.date}</p></div>`;
    }
    catch(e)
    {
        console.log("Error during update UI: ",e)
    }
}