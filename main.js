const originalOrder = ['0% 0%','33.3% 0%', '66.6% 0%', '100% 0%',
                '0% 33.3%', '33.3% 33.3%', '66.6% 33.3%', '100% 33.3%',
                '0% 66.6%', '33.3% 66.6%', '66.6% 66.6%', '100% 66.6%',
                '0% 100%', '33.3% 100%', '66.6% 100%', '']
const cells = [...Array(16).keys()]                
const imageUrl = 'url("images/monks.jpg")'
let emptyCell = 1
let shuffledOrder

const initialize = () =>{
    //random number from 0 to 15
    //emptyCell = Math.floor(Math.random() * 16)
    console.log('empty: ' + emptyCell)

    shuffledOrder = shuffle([...originalOrder])
    arraymove(shuffledOrder, shuffledOrder.indexOf(''), emptyCell)

    shuffledOrder.forEach((position, index)=>{
        const piece = document.getElementById(`piece${index}`)
        if(position !== ''){
            piece.style.backgroundImage = imageUrl
            piece.style.backgroundPosition = position
        }
    })
    console.log(shuffledOrder)
}

const movePiece = (num) =>{
    const clickedPiece = document.getElementById(`piece${num}`)
    if(isMovementAllowed(num)){
        clickedPiece.style.backgroundImage = ''
        const emptyPiece = document.getElementById(`piece${emptyCell}`)
        emptyPiece.style.backgroundImage = imageUrl
        emptyPiece.style.backgroundPosition = clickedPiece.style.backgroundPosition
        emptyCell = num 
        arraymove(shuffledOrder,shuffledOrder.indexOf(clickedPiece.style.backgroundPosition), shuffledOrder.indexOf(''))
        arraymove(shuffledOrder, shuffledOrder.indexOf(''), emptyCell)

    }
    console.log(shuffledOrder)
    console.log(isSameArray())

}


function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

const isSameArray = () =>{
    const sharedValues = originalOrder.filter((value, index)=>{
        if(value === shuffledOrder[index]) return value
    })
    if(sharedValues.length === originalOrder.length){
        return true
    }else{
        return false
    }
}

const isMovementAllowed = (num) =>{
    const width = 4
    const height = 4
    switch(num){
        case 0:
            if(emptyCell === num + 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 1:
        case 2:
            if(emptyCell === num - 1 || emptyCell === num + 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 3:
            if(emptyCell === num - 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 4:
        case 8:
            if(emptyCell === num - width || emptyCell === num + 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 5:
        case 6:
        case 9:
        case 10:
            if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 7:
        case 11:
            if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + width){
                return true
            }else{
                return false
            }
        case 12:
            if(emptyCell === num - width || emptyCell === num + 1){
                return true
            }else{
                return false
            }
        case 13:
        case 14:
            if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + 1){
                return true
            }else{
                return false
            }
        case 15:
            if(emptyCell === num - 4 || emptyCell === num - 1){
                return true
            }else{
                return false
            }
    }
}

/*0: 1 - 4
1: 0 - 2 - 5
2: 1 - 3 - 6
3: 2 - 7
4: 0 - 5 - 8
5: 1 - 4 - 6 - 9
6: 2 - 5 - 7 - 10
7: 3 - 6 - 11
8: 4 - 9 - 12
9: 5 - 8 - 10 - 13
10: 6 - 9 - 11 - 14
11: 7 - 10 - 15
12: 8 - 13
13: 9 - 12 - 14
14: 10 - 13 - 15
15: 11 - 14*/