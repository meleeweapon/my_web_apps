// implementing an alarm() api with promises

// args: name of the person to wake up,
// delay in ms to wait before waking the person up

// behavior: after the delay, sends a message "wake up"
// with the persons name

// essentially this will be a setTimeout() wrapper

let nameInput = document.querySelector("#name-input")
let timeInput = document.querySelector("#time-input")
let output = document.querySelector("#output")
let setAlarmBtn = document.querySelector("#set-alarm-btn")

// version without promises
// function setAlarm(nameOfPerson, milliseconds) {
//     setTimeout(() => {
//         // console.log(`Wake up, ${nameOfPerson}`)
//         output.textContent = `Wake up, ${nameOfPerson}`
//     }, milliseconds)
// }

// setAlarmBtn.addEventListener("click", ()=>{
//     let nameOfPerson = nameInput.value
//     let time = parseInt(timeInput.value) * 1000
//     if (!isNaN(time)) {
//         setAlarm(nameOfPerson, time)
//     } else {
//         // console.log("Type a number in the 'Seconds to wait' box.")
//         output.textContent = "Type a number in the 'Seconds to wait' box."
//     }
// })



function alarm(nameOfPerson, milliseconds) {
    return new Promise((resolve, reject)=>{
        if (isNaN(milliseconds)) {
            throw new Error("Given time was Nan. It should be a number.")
        }
        if (milliseconds < 0) {
            throw new Error("Given time was smaller than 0. It must me 0 or greater.")
        }
        setTimeout(()=>{
            resolve(`Wake up, ${nameOfPerson}`)
        }, milliseconds)
    })
}

// setAlarmBtn.addEventListener("click", ()=>{
//     let nameOfPerson = nameInput.value
//     let timeInMilliseconds = parseInt(timeInput.value) * 1000
//     output.textContent = "Alarm has been set."
//     alarm(nameOfPerson, timeInMilliseconds)
//         .then((message)=>{ output.textContent = message })
//         .catch((error)=>{ console.log(error) })
// })

// async await version
setAlarmBtn.addEventListener("click", async ()=>{
    try {
        let nameOfPerson = nameInput.value
        let timeInMilliseconds = parseInt(timeInput.value) * 1000
        output.textContent = "Alarm has been set."
        output.textContent = await alarm(nameOfPerson, timeInMilliseconds)
    }
    catch (error) {
        console.error(error)
        output.textContent = "An error occured."
    }
})