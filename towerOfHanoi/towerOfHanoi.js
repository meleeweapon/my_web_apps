// cut this part and paste into another file
// ####################################################### 
// In a party of N people, each person will shake her/his 
// hand with each other person only once. In total how 
// many hand-shakes would happen?

function totalHandshakes(num) {
    if (num <= 1) {
        return 0
    }
    return totalHandshakes(num - 1) + num - 1
}

console.log(totalHandshakes(5))

// ####################################################### 

function hanoi(disc, src, dst, aux, arr){
    if (disc <= 0) {
        return
    }

    hanoi(disc - 1, src, aux, dst, arr)

    console.log(`Move disc ${disc} from ${src} to ${dst}`);
    arr.push({disc: disc, src: src, dst: dst})

    hanoi(disc - 1, aux, dst, src, arr)
}

// This function call will solve the puzzle for 3 discs
let moves = []
hanoi(3, "Source", "Auxiliary", "Destination", moves);


const nextMoveBtn = document.querySelector("#next-move-btn") 
console.log(nextMoveBtn)

const sourceRod = document.querySelector("#source-rod")
console.log(sourceRod)

const auxiliaryRod = document.querySelector("#auxiliary-rod")
console.log(auxiliaryRod)

const destinationRod = document.querySelector("#destination-rod")
console.log(destinationRod)

const stringVarRods = {
    "Source": sourceRod,
    "Auxiliary": auxiliaryRod,
    "Destination": destinationRod,
}

function removeTopDiscLegacy(innerHTML) {
    let target = "</div>"
    let streak = 0
    let endInd = 0
    for (x in innerHTML) {
        if (innerHTML[x] === target[streak]) {
            streak++;
        }
        else streak = 0
        if (streak >= target.length) {
            endInd = x
            break
        }
    }
    endInd++
    return innerHTML.slice(endInd)
}

function addDiscOnTop(innerHTML) {

}

const allDiscs = {
    emptyDiscSlot: `            <div class="empty-disc-slot"></div>`,
    smallestDisc:  `            <div class="smallest-disc"></div>`,
    middleDisc:    `            <div class="middle-disc"></div>`,
    biggestDisc:   `            <div class="biggest-disc"></div>`,
    rodBase:       `            <div class="rod-base"></div>`,
}

let sourceRodDiscs = [
    allDiscs.smallestDisc, 
    allDiscs.middleDisc,
    allDiscs.biggestDisc,
    allDiscs.rodBase]

let auxiliaryRodDiscs = [allDiscs.emptyDiscSlot,
    allDiscs.emptyDiscSlot,
    allDiscs.emptyDiscSlot,
    allDiscs.rodBase]

let destinationRodDiscs = [allDiscs.emptyDiscSlot,
    allDiscs.emptyDiscSlot,
    allDiscs.emptyDiscSlot,
    allDiscs.rodBase]

function rodArrToHtml(rodArr) {
    return rodArr.join("")
}

function renderRods() {
    sourceRod.innerHTML = rodArrToHtml(sourceRodDiscs)
    auxiliaryRod.innerHTML = rodArrToHtml(auxiliaryRodDiscs)
    destinationRod.innerHTML = rodArrToHtml(destinationRodDiscs)
}

const strToRodArr = {
    "Source": sourceRodDiscs,
    "Auxiliary": auxiliaryRodDiscs,
    "Destination": destinationRodDiscs,
}

renderRods()


function moveDiscLegacy(obj) {
    console.log(obj.src)
    let inHTML = stringVarRods[obj.src].innerHTML
    console.log(inHTML)
    console.log(removeTopDisc(inHTML))

    // remove the disk
    stringVarRods[obj.src].innerHTML = removeTopDisc(inHTML)
    // add empty disk slot
    stringVarRods[obj.src].innerHTML 
    = `            <div class="empty-disc-slot"></div>` 
    + stringVarRods[obj.src].innerHTML

    console.log(stringVarRods[obj.src].innerHTML)

    // remove empty disk slot from dest
    // add disk
}
// moveDisc(moves[0])

function removeTopDisc(rodArr) {
    let removedElement = undefined
    for (ind in rodArr) {
        if (rodArr[ind] != allDiscs.emptyDiscSlot && 
            rodArr[ind] != allDiscs.rodBase) {
            removedElement = rodArr[ind]
            rodArr[ind] = allDiscs.emptyDiscSlot
            break
        }
    }
    return removedElement
}

function addDiscOnTop(rodArr, disc) {
    let targetInd = undefined
    for (ind in rodArr) {
        if (rodArr[ind] != allDiscs.emptyDiscSlot) {
            targetInd = ind
            break
        }
    }
    targetInd--
    rodArr[targetInd] = disc
}

// removeTopDisc(sourceRodDiscs)
// addDiscOnTop(auxiliaryRodDiscs, allDiscs.middleDisc)
// addDiscOnTop(auxiliaryRodDiscs, allDiscs.smallestDisc)
// renderRods()

function moveDisc(moveObj) {
    let srcArr = strToRodArr[moveObj.src]
    let dstArr = strToRodArr[moveObj.dst]

    let removedDisc = removeTopDisc(srcArr)
    addDiscOnTop(dstArr, removedDisc)
    renderRods()
}

let moveInd = 0

nextMoveBtn.addEventListener("click", ()=>{
    if (moveInd < moves.length) {
        moveDisc(moves[moveInd])
        moveInd++
    }
})