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
readRecords("attendance", {}, function(records) {
    let file = new Blob([JSON.stringify(records)], {type: 'text/plain'});
    let a = document.getElementById("a")
    a.href = URL.createObjectURL(file)
    a.download = fileName()+".json"
    a.click()
})