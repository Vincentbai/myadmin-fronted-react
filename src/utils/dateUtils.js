export function formateTime(time){
    if(!time) return ''
    const date = new Date(time)
    return date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds()
}

export function formateDate(dateString){
    if(!dateString) return ''
    const date = new Date(dateString)
    return date.getDate() +'-'+ (date.getMonth()+1) +'-'+ date.getFullYear()
}

export function formateDay(){

    switch(new Date().getDay()){
        case 0:
            return 'Sunday'
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
        default: 
    }
}
