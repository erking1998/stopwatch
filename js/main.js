// Declare Global Variables
	// Get Current Stopwatch time value from HTML Page
	var hour=parseInt(document.getElementById("hour").innerHTML);
	var minute=parseInt(document.getElementById("minute").innerHTML);
	var second=parseInt(document.getElementById("second").innerHTML);

	//Use For START STOP
	var startinterval;

	//Use For LAP
	var lasttime=new Date("0001-01-01T00:00:00");
	var currenttime;
	var totaltime=0;
	var laplogs=[];
	var lapno=1;

	//Use For History 
	let history=new Array();
	const localStorageContent = localStorage.getItem('StopwatchHistoryData');
	if(localStorageContent != null)
	{
		history=JSON.parse( localStorageContent);
	}
	var temphour=twodigitmagic(parseInt(document.getElementById("hour").innerHTML));
	var tempminute=twodigitmagic(parseInt(document.getElementById("minute").innerHTML));
	var tempsecond=twodigitmagic(parseInt(document.getElementById("second").innerHTML));


//Start Button Event
function calling()
{	
	startinterval=setInterval(start,1000);
	document.getElementById("but1").value = "Pause";
	document.getElementById('but1').setAttribute( "onClick", "pause()" );
}

//Start button Event , call via calling() function
function start()
{	
	if(second==59)
	{
		second=0;
		document.getElementById("second").innerHTML=twodigitmagic(second);	
		if(minute==59)
		{
			minute=0;
			document.getElementById("minute").innerHTML=twodigitmagic(minute);
			if(hour==59) 
			{
				hour=0;
				document.getElementById("hour").innerHTML=twodigitmagic(hour);
			}
			else
			{
				hour=hour+1;
				document.getElementById("hour").innerHTML=twodigitmagic(hour);
			}
		}
		else
		{
			minute=minute+1;
			document.getElementById("minute").innerHTML=twodigitmagic(minute);
		}
	}
	else
	{
		second=second+1;
		document.getElementById("second").innerHTML=twodigitmagic(second);	
	}		
}


//Pause Button Event
function pause()
{
	clearInterval(startinterval);
	document.getElementById("but1").value = "Resume";
	document.getElementById('but1').setAttribute( "onClick", "calling()" );
}



//Stop Button Event
function stop()
{
	clearInterval(startinterval);
	hour=parseInt("00");
	minute=parseInt("00");
	second=parseInt("00");
	document.getElementById("but1").value = "Start";
	document.getElementById('but1').setAttribute( "onClick", "calling()" );

	// For History , Store log in history using localstorage
	temphour=twodigitmagic(parseInt(document.getElementById("hour").innerHTML));
	tempminute=twodigitmagic(parseInt(document.getElementById("minute").innerHTML));
	tempsecond=twodigitmagic(parseInt(document.getElementById("second").innerHTML));
	currenttime=temphour+":"+tempminute+":"+tempsecond;
	if(currenttime!="00:00:00"){
		let today=new Date();
		history[history.length++]={starttime:'00:00:00',endtime:currenttime,TimeRecorded:today};
		let jsontemp=JSON.stringify(history);
		localStorage.setItem('StopwatchHistoryData', jsontemp);
	}
}


//Reset Button Event 
function reset()
{
	clearInterval(startinterval);
	hour=parseInt("00");
	minute=parseInt("00");
	second=parseInt("00");
	document.getElementById("second").innerHTML="00";
	document.getElementById("minute").innerHTML="00";
	document.getElementById("hour").innerHTML="00";
	document.getElementById("but1").value = "Start";
	document.getElementById('but1').setAttribute( "onClick", "calling()" );
	lapno=1;
	document.getElementById("laplog").innerHTML="";
	lasttime=new Date("0001-01-01T00:00:00");
	totaltime=0;

	//Clear History Logs Portion in HTML 
	document.getElementById("historylog").innerHTML="";
}

function lap()
{	
	// //Clear History Logs Portion in HTML
	document.getElementById("historylog").innerHTML="";
	

	//Code for maximum 10 laps log , Stop rest of Function code Exicution
	if(lapno>10){return true;}

	temphour=twodigitmagic(parseInt(document.getElementById("hour").innerHTML));
	tempminute=twodigitmagic(parseInt(document.getElementById("minute").innerHTML));
	tempsecond=twodigitmagic(parseInt(document.getElementById("second").innerHTML));
		
	currenttime=temphour+":"+tempminute+":"+tempsecond;
	currenttime=new Date("0001-01-01T"+currenttime);
		
	let diffinsecond=diff_minutes(currenttime,lasttime);
	lasttime=currenttime;
	let diffinformate=second_to_formate(diffinsecond);
		
	totaltime=totaltime+diffinsecond;
	let totaltimeinformate=second_to_formate(totaltime);

	document.getElementById("laplog").innerHTML+="Lap "+lapno+".&nbsp; "+diffinformate+" &nbsp;&nbsp;"+totaltimeinformate+"<br>";
	lapno=lapno+1;
}


//History Button Event	
function showhistory()
{
	// Clear Lap Log Portion in HTML
	document.getElementById("laplog").innerHTML = "";
	lapno=1;

	//For History Log Print 
	var hislog = JSON.parse(localStorage.getItem("StopwatchHistoryData"));
	document.getElementById("historylog").innerHTML="";
 	hislog.reverse();
	for(let i = 0; (i<hislog.length) && (i<10); i++) {
		document.getElementById("historylog").innerHTML+="Data "+(i+1)+".&nbsp; "+hislog[i].starttime+" &nbsp;&nbsp;"+hislog[i].endtime+" &nbsp; "+hislog[i].TimeRecorded+"<br>";
	}
}



//Find Difference betweek two time and return different in seconds
function diff_minutes(currenttime,lasttime) 
{
	var diff =(currenttime.getTime() - lasttime.getTime()) / 1000;
	return diff; 
}

//Convert Seconds in H:M:S formate	
function second_to_formate(diffinsecond)
{
   	var h = twodigitmagic(Math.floor(diffinsecond / 3600));
   	var m = twodigitmagic(Math.floor(diffinsecond % 3600 / 60));
   	var s = twodigitmagic(Math.floor(diffinsecond % 3600 % 60));
    return h+":"+m+":"+s;
}

//Use For the convert H:M:S formate to HH:MM:SS
function twodigitmagic(val) {
	return (val < 10) ? '0' + val.toString() : val.toString();
}