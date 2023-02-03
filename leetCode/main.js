let allMains = []

// individual projects codes begins here
function medianOfTwoSortedArraysMain() {
    /**
     *  * @param {number[]} nums1
     *   * @param {number[]} nums2
     *    * @return {number}
     *     */
    var findMedianSortedArrays = function(nums1, nums2) {
        let totalLen = nums1.length + nums2.length;
        let totalLenHalved = undefined;

        let k = 0;
        let m = 0;
        let median = undefined;

        // two versions for odd and even len
        if (totalLen % 2 === 0) {
            totalLenHalved = (totalLen / 2) - 1;

            // iter until k + m is at total len halved, where the median is
            while (k + m < totalLenHalved) {
                if (nums1[k] < nums2[m]) {k++;} else {m++;};
            }

            // for even: get 2 closest to middle elms and get their avg
            let temp = 0;
            if (nums1[k] < nums2[m]) {temp = nums1[k]; k++}
                        else {temp = nums2[m]; m++};
            if (nums1[k] < nums2[m]) {median = (temp + nums1[k]) / 2}
                        else {median = (temp + nums2[m]) / 2};
        } else {
            totalLenHalved = Math.floor(totalLen / 2);

            while (k + m < totalLenHalved) {
                if (nums1[k] < nums2[m]) {k++;} else {m++;};
            };

            // for odd: get the middle elm
            if (nums1[k] < nums2[m]) {median = nums1[k]}
                        else {median = nums2[m]};
        };

        return median;
    };

    // for debug purposes
    const merge = (arr1, arr2) => {
        let result = [];
        let x = 0;
        let y = 0;

        while (x < arr1.length && y < arr2.length) {
            if (arr1[x] < arr2[y]) {
                result.push(arr1[x]);
                x++;
            } else {
                result.push(arr2[y]);
                y++;
            }
        }

        while (x < arr1.length) {
            result.push(arr1[x]);
            x++;
        }
        while (y < arr2.length) {
            result.push(arr2[y]);
            y++;
        }

        return result;
    }
    const findMedian = (arr) => {
        let half = 0;
        if (arr.length % 2 === 0) {
            half = Math.floor(arr.length / 2) - 1;
            result = (arr[half] + arr[half + 1]) / 2;
        } else {
            half = Math.floor(arr.length / 2);
            result = arr[half];
        }
        return result;
    };

    let nums1 = [1,3,4,5,7,9,64];
    let nums2 = [2,6,8,11,12];
    let nums3 = [2,3,5,7,8,16,27,574,8658];
    console.log(findMedianSortedArrays(nums2, nums1));
    console.log(findMedian(merge(nums2, nums1)));
}
allMains.push(medianOfTwoSortedArraysMain)




function topKFrequentWordsMain() {
    /**
     *  * @param {string[]} words
     *   * @param {number} k
     *    * @return {string[]}
     *     */

    // not finished, lexicographical sorting between the words that has the same count not imped
    var topKFrequent = function(words, k) {
        uniqueWords = {};
        for (let x = 0; x < words.length; x++) {
            if (uniqueWords[words[x]] === undefined) {
                uniqueWords[words[x]] = 1;
            } else {
                uniqueWords[words[x]] += 1;
            }
        };

        let result = [];
        for (let y = 0; y < k; y++) {
            let bword = "";
            let biggest = 0;
            for (const key in uniqueWords) {
                if (uniqueWords[key] > biggest) {
                    if (!(result.includes(key))) {
                        bword = key;
                        biggest = uniqueWords[key];
                    };
                };
            };
            result.push(bword);
            result.push(biggest);
        };

        result.sort();

        return result;
    };

    // console.log(topKFrequent(["i","love","leetcode","i","love","coding"]))
    console.log(topKFrequent(["the","day","is","sunny","the","the","the","sunny","is","is"], 4))
}
allMains.push(topKFrequentWordsMain)




function zigzagConversionMain() {
    function* zigzag(start, end) {
        let x = start
        let dir = -1
        let justChanged = false
        let y = undefined
        while (true) {
            if (x < end -1 && x > start || justChanged) {
                justChanged = false
                y = x
                x += dir
                yield y
            } else {
                justChanged = true
                dir *= -1
            }
        }
    }

    var convert = function(s, numRows) {
        let result = ""
        resRows = {}
        let ind = zigzag(0, numRows)
        for (let q = 0; q < numRows; q++) {
            resRows[q] = ""
        }
        
        for (char in s) {
            resRows[ind.next().value] += (s[char])
        }

        for (let m = 0; m < numRows; m++) {
            result += resRows[m]
        }

        return result
    };

    console.log("output:           " + convert("PAYPALISHIRING",3))
    console.log("expected outcome: " + "PAHNAPLSIIGYIR")
}
allMains.push(zigzagConversionMain)




function guessNumberHigherOrLowerMain() {
    function determineAnswer(n) {
        return Math.floor((Math.random() * n)) + 1
    }

    var guessNUmber = function(n) {
        var guess = function(num) {
            if (num < answer) { return  1 } else 
            if (num > answer) { return -1 } 
            else { return num }
        }

        let answer = determineAnswer(n)
        console.log(guess(7))
    }

    guessNUmber(10)

}
allMains.push(guessNumberHigherOrLowerMain)




function removeDuplicatesFromSortedArrayMain() {
    var removeDuplicates = function(nums) {
        let ind = 0
        let temp = null
        let k = 0
        while (nums.length > ind) {
            while (nums[ind] === temp) {
                nums.splice(ind, 1)
                k = ind
            }
            temp = nums[ind]
            ind++
        }
        return k
    };
    let xoulma = [1,1,1,1,2,3,4,4,4,4]
    console.log(removeDuplicates(xoulma))
    console.log(xoulma)
}
allMains.push(removeDuplicatesFromSortedArrayMain)




function plusOneMain() {
    var plusOne = function(digits) {
        let temp = digits.slice()
        // last digit being 9 results in overlap so here's a check
        if (temp[temp.length - 1] === 9) {
            let x = temp.length - 1

            // skip throug all the 9's
            while (temp[x] === 9) {
                x--
            }

            if (x < 0) {
                // in which case all digits are 9
                // means it'll overlap to the next digit
                // then insert 1 at the beginning
                temp.unshift(1)
                // set x to 1 so the 1 we added doesn't
                // get zeroed out too
                x = 1
            } else {
                // increment the digit before all 9's
                temp[x] += 1
                x++
            }

            // zero out remaining 9's
            while (x < temp.length) {
                temp[x] = 0
                x++
            }

            return temp
        // usual route if last digit isn't 9
        } else {
            temp[temp.length - 1] += 1
            return temp
        }
    };

    console.log(plusOne([1,2,3]))
    console.log(plusOne([4,3,2,1]))
    console.log(plusOne([9]))
}
allMains.push(plusOneMain)




function removeElementMain() {
    var removeElement = function(nums, val) {
        let x = 0
        while (x < nums.length) {
            while (nums[x] === val) {
                nums.splice(x, 1)
            }
            x++
        }

        return x === 0 ? 0 : x - 1
    };

    let test1 = [3,2,2,3]
    console.log(removeElement(test1, 3))
    console.log(test1)

    let test2 = [0,1,2,2,3,0,4,2]
    console.log(removeElement(test2, 2))
    console.log(test2)
}
allMains.push(removeElementMain)




function searchIndexPositionMain() {
    function range(x) {
        let res = []
        for (let y = 0; y < x; y++) {
            res.push(y)
        }
        return res
    }

    var searchInsert = function(nums, target) {
        // special case
        if (target < nums[0]) {return 0}

        // do binary search:
        // set two limiters and
        // approach them together
        let k = 0
        let m = nums.length

        let w = undefined
        while (k !== m) {
            w = Math.floor(((m - k) / 2) + k)
            if (nums[w] > target) { m = w } else 
            if (nums[w] < target) { k = w } 
            else { return w }

            // determine if target isn't in nums by:
            // return the ind which target would be at
            if (m - 1 === k) {
                w = Math.floor(((m - k) / 2) + k)
                return w + 1
            }
        }
        return w
    };

    console.log(searchInsert([1,3,5,6], 5))
    console.log(searchInsert([1,3,5,6], 2))
    console.log(searchInsert(range(10000), 7429))
}
allMains.push(searchIndexPositionMain)




function twoSumMain() {
    function twoSumSlow(nums, target) {
        for (let x = 0; x < nums.length; x++) {
            for (let y = x + 1; y < nums.length; y++) {
                if (nums[x] + nums[y] === target) {
                    return [x,y]
                }
            }
        }
    }

    function twoSumClever(nums, target) {
        let potentialAnswers = {}
        for (x in nums) {
            if (potentialAnswers[nums[x]] !== undefined) {
                return [x, potentialAnswers[nums[x]].ind]
            }
            potentialAnswers[target - nums[x]] = {value: nums[x], ind: x}
        }
        return []
    }

    console.log(twoSumClever([2,7,11,15], 9))
}
allMains.push(twoSumMain)




function productOfArrayExceptForSelfMain() {
    // a bit slower but works with 0
    function productOfArrayExceptForSelf(arr) {
        let product = 1
        let zeroIndices = []
        for (i in arr) {
            if (arr[i] === 0) {
                zeroIndices.push(i)
                continue
            }
            product *= arr[i]
        }

        if (zeroIndices.length <= 0) {
            let result = []
            for (element of arr) {
                result.push(product / element)
            }
            return result
        } else {
            let result = new Array(arr.length).fill(0)
            if (zeroIndices.length === 1) {
                result[zeroIndices[0]] = product
                return result
            } else {return result}
        }
    }

    // smaller version of the first one
    // fast but doesn't work with 0
    function productOfArrayExceptForSelf2(arr) {
        let productOfAll = arr.reduce((x, y) => x * y)
        let result = []
        for (element of arr) {
            result.push(productOfAll / element)
        }
        return result
    }

    // different approach.
    // if the product approaches
    // js's Infinity and if there is a 0,
    // result gets filled with NaN because
    // Infinity * 0 === NaN.
    function productOfArrayExceptForSelf3(arr) {
        let productLeft = []
        let productRight = []
        let result = []

        // build the left part
        productLeft.push(1)
        for (let i = 1; i < arr.length; i++) {
            productLeft.push( productLeft[i - 1] * arr[i - 1] )
        }

        productRight.unshift(1)
        for (let i = 1; i < arr.length; i++) {
            productRight.unshift( productRight[productRight.length - i] * arr[arr.length - i] )
        }

        for (i in arr) {
            result.push( productLeft[i] * productRight[i] )
        }

        return result
    }


    const x = (()=>{
    let result = []
        for (let i = -3; i < 4; i++) { result.push(i) }
        return result
    })()
    console.log(x)
    // x.unshift(0)
    // x.unshift(0)
    console.log(productOfArrayExceptForSelf(x))
    console.log(productOfArrayExceptForSelf2(x))
    console.log(productOfArrayExceptForSelf3(x))
}
allMains.push(productOfArrayExceptForSelfMain)
// projects code ends here
// --------------------------------------------------------------------------





// --------------------------------------------------------------------------
// main sites code begins here:
function funcMainNameToId(mainName) {
    return mainName.substring(0, mainName.length - 4)
}

function camelCaseToNormal(str) {
    let res = str[0].toUpperCase()
    for (let x = 1; x < str.length; x++) {
        if (str[x].toUpperCase() === str[x]) {
            res += " "
        }
        res += str[x]
    }
    return res
}

function listInnerHtml(mainsArr) {
    return mainsArr.reduce((x, y) => {
        return x + "<li><button id='" + funcMainNameToId(y.name) + "'>" 
        + camelCaseToNormal(funcMainNameToId(y.name)) + "</button></li>"
    }, "")
}

function initButtsAndELs(mainsArr) {
    for (x in mainsArr) {
        let buttonId = funcMainNameToId(mainsArr[x].name)
        buttons[buttonId] = document.getElementById(buttonId)
        eventListeners[buttonId] = buttons[buttonId].addEventListener("click", mainsArr[x])
    }
}



const linksList = document.getElementById("ul")

let buttons = {}
let eventListeners = {}

linksList.innerHTML = listInnerHtml(allMains)
initButtsAndELs(allMains)

// execute the last added main to allMains
// for convenience
allMains[allMains.length - 1]()
