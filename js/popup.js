let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();

let historyHour = {};
let historyToday = {};
let historyLastWeek = {};
let historyLastMonth = {};
let historyOlder = {};

let currentDate = new Date();
let currentTimeInMillis = currentDate.getTime();

function PutHistoryItemInGroup(group, historyItem)
{
    let hostname = ExtractHostname(historyItem.url);
    if(!(hostname in group))
    {
        group[hostname] = [];
    }
    group[hostname].push(historyItem);
}

historyItems.map((historyItem) =>
{
    let hoursOld = Math.ceil((currentTimeInMillis - historyItem.timeStamp) / 3600000);
    let daysOld = Math.ceil(hoursOld/24);
    if(hoursOld <= 1)
        PutHistoryItemInGroup(historyHour, historyItem);
    else if (daysOld <= 1)
        PutHistoryItemInGroup(historyToday, historyItem);
    else if (daysOld <= 7)
        PutHistoryItemInGroup(historyLastWeek, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyLastMonth, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyOlder, historyItem);
});

function FillUpHistory(historyObject, parentDomId)
{
    let i = 1;
    for (var hostName in historyObject) {
        if (historyObject.hasOwnProperty(hostName)) {
            let id = parentDomId.id+i;
            i++;
            parentDomId.innerHTML += `
            <a class="btn btn-outline-primary btn-block" data-toggle="collapse" href="#${id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                ${hostName}
            </a>
            <div class="collapse" id="${id}">
                <div class="card card-body history-item-element" id="${id}-card">
                </div>
            </div>
            `;
            let historyArray = historyObject[hostName];
            for (let i = historyArray.length - 1; i >= 0; --i)
            {
                let url = historyArray[i].url;
                if (url)
                {
                    let domain = historyArray[i].hostname;
                    let favicon = "../image/browseraction_icon_40.png";
                    if(historyArray[i].favicon != undefined)
                    {
                        favicon = historyArray[i].favicon;
                    }
                    let date = new Date(historyArray[i].timeStamp);
                    let dateString = "";
                    if(Math.ceil((currentTimeInMillis - historyArray[i].timeStamp) / 3600000) <= 24)
                    {
                        dateString = date.getHours() % 12;
                        if((date.getHours() % 12) < 10)
                        {
                            dateString = "0" + dateString;
                        }
                        dateString += ":";
                        if(date.getMinutes() < 10)
                        {
                            dateString += "0"; 
                        }
                        dateString += date.getMinutes() + " ";
                        if(date.getHours() < 12)
                        {
                            dateString+="A.M";
                        }
                        else
                        {
                            dateString+="P.M";
                        }
                    }
                    else
                    {
                        dateString = date.getDate()+ "-" + date.getMonth() + "-" + date.getFullYear();
                    }
                    document.getElementById(id + "-card").innerHTML += `
                    <div class="row">
                        <div class="col-1">
                        <img src="${favicon}" class="favicon">
                        </div>
                        <div class="col-8">
                        <div class="title-text">${historyArray[i].title}, ${historyArray[i].hostname}</div>
                        <div><a href="${url}" class="url-text">${url}</a></div>
                        </div>
                        <div class="col-2 time-text-parent">
                        <span class="time-text">${dateString}</span>
                        </div>
                    </div>
                    `;
                    if( i > 0)
                    {
                        document.getElementById(id + "-card").innerHTML += '<hr>';
                    }
                }
            }
        }
    }
}

FillUpHistory(historyHour, thisHourHistoryItems);
FillUpHistory(historyToday, todayHistoryItems);
FillUpHistory(historyLastWeek, thisWeekHistoryItems);
FillUpHistory(historyLastMonth, lastMonthHistoryItems);
FillUpHistory(historyOlder, olderHistoryItems);

$("#loader").css("display","none");
$("#content").css("display","block");