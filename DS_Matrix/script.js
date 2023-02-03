function dis(x) {
    for (key in x) {
        console.log(key + ": ", x[key])}}
function l(any) {console.log(any)}
function lm(matrix) {
    console.log("###################")
    for (x in matrix) {console.log(matrix[x])}
    console.log("###################")}

// ---------------------------------------------------------
// constructing a matrix
let m1 = [[1,2,3], [4,5,6], [7,8,9]]
// dis({m1})

function get3x3MCWPath(m) {
    let arr = []
    for (let x = 0; x < m.length; x++) {
        if (x === 0) {
            for (let y = 0; y < m[x].length; y++) {
                // arr.push(m[x][y])
                arr.push({"x": x, "y": y})
            }
        } else if (x === m.length - 1) {
            for (let z = m[x].length - 1; z >= 0; z--) {
                // arr.push(m[x][z])
                arr.push({"x": x, "y": z})
            }
        } else {
            // arr.push(m[x][m.length - 1])
                arr.push({"x": x, "y": m.length - 1})
        }
    }
    for (let x = 0; x < m.length; x++) {
        if (x !== 0 && x !== m.length - 1) {
            // arr.push(m[x][0])
                arr.push({"x": x, "y": 0})
        }
    }
    return arr
}

function get3x3MCWPath2(m) {
    let r = []
    let x = 0
    let y = 0
    // for (let q = 0; q < 4; x++){
    // }
    l(m[x].length)
    while (y < m[x].length){
        r.push({"x": x, "y": y})
        y++
    }
    r.pop()
    y--
    while (x < m.length){
        r.push({"x": x, "y": y})
        x++
    }
    r.pop()
    x--
    while (y >= 0){
        r.push({"x": x, "y": y})
        y--
    }
    r.pop()
    y++
    while (x >= 0){
        r.push({"x": x, "y": y})
        x--
    }
    r.pop()
    x++
    return r
}

const copyMatrix = m => {
    let r = []
    for (k in m){
        let t = []
        for (w in m[k]){
            t.push(m[k][w])
        }
        r.push(t)
    }
    return r
}
function rotate3x3MCW(m) {
    let r = copyMatrix(m)
    const paths = get3x3MCWPath(r)
    let temp = undefined
    let temp2 = r[paths[paths.length - 1].x][paths[paths.length - 1].y]
    for (p in paths) {
        temp = r[paths[p].x][paths[p].y]
        r[paths[p].x][paths[p].y] = temp2
        temp2 = temp
    }
    return r
}


lm(m1)
lm(rotate3x3MCW(m1))