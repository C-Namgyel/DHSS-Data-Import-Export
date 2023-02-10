function str(int) {
    return(''+int)
}
function fileName() {
    let x = new Date()
    let month = x.getMonth() + 1;
    if (month < 10) {
        month = "0"+month
    }
    let date = x.getDate()
    if (date < 10) {
        date = "0"+date
    }
    let hour = x.getHours()
    if (hour < 10) {
        hour = "0"+hour
    }
    let minute = x.getMinutes()
    if (minute < 10) {
        minute = "0"+minute
    }
    return(str(x.getFullYear())+str(month)+str(date)+str(hour)+str(minute))
}
function message(placeHolder, enableSeconds, id) {
    let div = document.createElement("div")
    div.style.width = "65%"
    div.style.position = "fixed"
    div.style.top = "0%"
    div.style.left = "12.5%"
    div.style.borderStyle = "solid"
    div.style.borderWidth ="1px"
    div.style.borderRadius = "15px"
    div.style.backgroundColor = "white"
    div.style.zIndex = "150"
    div.style.padding ="5%"
    let label = document.createElement("label")
    label.innerHTML = placeHolder,
    label.style.display = "inline-block"
    label.style.width = "100%";
    let ok = document.createElement("button");
    ok.style.width = "25%"
    ok.innerHTML = "OK (" + enableSeconds + "s)"
    ok.style.float = "right"
    ok.style.borderStyle = "none"
    ok.style.backgroundColor = "white"
    ok.disabled = true;
    if (id != undefined) {
        ok.id = id
    }
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(ok)
    document.body.appendChild(div)
    div.style.top = (((window.getComputedStyle(document.body).height).slice(0,this.length - 2) / 2) - (div.clientHeight / 2)) + "px"
    document.getElementById("barrier").hidden = false;
    if (enableSeconds < 0) {
        ok.hidden = true;
    } else if (enableSeconds == 0 || enableSeconds == undefined) {
        ok.innerHTML = "OK"
        ok.hidden = false;
        ok.disabled = false;
    } else {
        let CDNum = enableSeconds;
        let CD = setInterval(function() {
            CDNum -= 1;
            ok.innerHTML = "OK (" + CDNum + "s)"
            if (CDNum <= 0) {
                ok.disabled = false;
                ok.innerHTML = "OK";
                clearInterval(CD);
            }
        }, 1000)
    }
    ok.onclick = function() {
        div.remove()
        document.getElementById("barrier").hidden = true;
    }
  }
//Import
document.getElementById("export").onclick = function() {
    message(`Exporting. <br>Download will start automatically.<br>
    The file name is in the format YYYYMMDDhhmm.json where 'Y' means 'Year', 'M' means 'Month', 'D' means 'Date', 'h' means 'hour', and 'm' means 'minute'`)
    readRecords("attendance", {}, function(records) {
        let file = new Blob([JSON.stringify(records)], {type: 'text/plain'});
        let a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = fileName()+".json"
        a.click()
    })
}
document.getElementById("importFile").oninput = function(file) {
    message("Importing", 0)
    let result;
    let fr=new FileReader();
    fr.readAsText(this.files[0]);
    fr.onload=function() {
        result = JSON.parse(fr.result);
        readRecords("attendance", {}, function(records) {
            let x = 0;
            while (x < records.length) {
                deleteRecord("attendance", {id:records[x].id}, function(success) {
                });
                x += 1;
            }
            let i = 0;
            let imported = 0;
            while (i < result.length) {
                createRecord("attendance", {absentee: result[i].absentee, class: result[i].class, date: result[i].date, initial: result[i].initial, lesson: result[i].lesson, period: result[i].period, section: result[i].section, subject: result[i].subject, time: result[i].time}, function(record) {
                    imported+= 1;
                    if (imported >= result.length) {
                        message("Successfully Imported", 0)
                    }
                });
                i += 1;
            }
        })
    }
}