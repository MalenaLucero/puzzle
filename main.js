const originalOrder = ['0% 0%','33.3% 0%', '66.6% 0%', '100% 0%',
                '0% 33.3%', '33.3% 33.3%', '66.6% 33.3%', '100% 33.3%',
                '0% 66.6%', '33.3% 66.6%', '66.6% 66.6%', '100% 66.6%',
                '0% 100%', '33.3% 100%', '66.6% 100%', '']              
const imageUrl = 'url("images/monks.jpg")'
let emptyCell = 16
let shuffledOrder = []
let organizedPieces = {}

const initialize = () =>{
    //hide 'you won!' message
    const winningMessage = document.getElementById('winningMessage')
    winningMessage.classList.replace('show', 'hide')

    //separates pieces in three groups: corners, sides, center
    organizePieces()

    //random number. This is the white tile
    //I took this function from Stackoverflow
    //emptyCell = Math.floor(Math.random() * originalOrder.length)

    //shuffles the original order of the tiles
    //shuffledOrder = shuffle([...originalOrder])
    shuffledOrder = originalOrder

    //moves the '' to the emptyCell index in shuffledOrder array
    arraymove(shuffledOrder, shuffledOrder.indexOf(''), emptyCell)

    //each tile is given a portion of the main picture as background, except the white tile
    const puzzleContainer = document.getElementById('puzzle-container')
    puzzleContainer.innerHTML = ''
    shuffledOrder.forEach((position, index)=>{
        const piece = document.createElement('div')
        piece.id = `piece${index}`
        piece.onclick = () => movePiece(index)
        if(position !== ''){
            piece.style.backgroundImage = imageUrl
            piece.style.backgroundPosition = position
        }else if(position === ''){
            piece.style.backgroundImage = ''
        }
        puzzleContainer.appendChild(piece)
    })
    console.log(shuffledOrder)
}

//onclick of each tile. 'num' is the number of the tile
const movePiece = (num) =>{
    const clickedPiece = document.getElementById(`piece${num}`)
    if(isMovementAllowed(num)){
        //the clicked tile becomes white
        clickedPiece.style.backgroundImage = ''
        //the previous white tile gets an image
        const emptyPiece = document.getElementById(`piece${emptyCell}`)
        emptyPiece.style.backgroundImage = imageUrl
        emptyPiece.style.backgroundPosition = clickedPiece.style.backgroundPosition
        //the number of the clicked tile becomes the empty cell
        emptyCell = num 
        //the porcentages change order in the shuffled array
        arraymove(shuffledOrder,shuffledOrder.indexOf(clickedPiece.style.backgroundPosition), shuffledOrder.indexOf(''))
        //the '' element goes to the empty cell index
        arraymove(shuffledOrder, shuffledOrder.indexOf(''), emptyCell)
    }
    if(isSameArray()){
        const winningMessage = document.getElementById('winningMessage')
        winningMessage.classList.replace('hide', 'show')
    }
}

//shuffles an array
//I took this function from CSS Tricks
function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

//replaces an element with another, both of which are part of the array
//I took this function from Stackoverflow
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

//compares the original array with the rearranged array and checks if they are the same
const isSameArray = () =>{
    const sharedValues = originalOrder.filter((value, index)=>{
            if(value === '' && shuffledOrder[index] === ''){
                return ' '
            }else if(value === shuffledOrder[index]){
                return value
            }
    })
    if(sharedValues.length === originalOrder.length){
        return true
    }else{
        return false
    }
}

const organizePieces = () =>{
    const width = 4
    const height = 4
    //the four corners
    const topLeft = 0
    const topRight = width -1
    const bottomLeft = (width * height) - width
    const bottomRight = (width * height) - 1
    organizedPieces.corners = [topLeft, topRight, bottomLeft, bottomRight]
    //the four sides (except corners)
    const top = arrayFromInterval(topLeft, topRight)
    const left = arrayFromJumps(width, height, bottomLeft)
    const right = arrayFromJumps(width, height, bottomRight)
    const bottom = arrayFromInterval(bottomLeft, bottomRight)
    organizedPieces.sides = [top, left, right, bottom]
    //the center pieces
    const center = arrayOfCenterPieces(width, height, bottomLeft, bottomRight)
    organizedPieces.center = center
}

//from an interval of integers, returns an array
//from 0 and 3, it returns [1, 2]
const arrayFromInterval = (start, end) =>{  
    let arr = []
    for(let i=start+1; i<end; i++){
        arr.push(i)
    }
    return arr
}

//returns the numbers from the sides
//in a 4x4 puzzle, with bottomCorner=12, it returns [4,8] (the left side numbers that are not corners)
const arrayFromJumps = (width, height, bottomCorner) =>{
    const loops = height - 2
    let arr = []
    for(let i=0; i < loops; i++){
        arr.push(bottomCorner - (width * (i+1)))
    }
    return arr
}

//returns the pieces of the center of the puzzle
const arrayOfCenterPieces = (width, height, bottomLeftCorner, bottomRightCorner) =>{
    const loops = height - 2
    let arr = []
    for(let i= 0; i<loops; i++){
        const start = bottomLeftCorner - (width * (i+1))
        const end = bottomRightCorner - (width * (i+1)) 
        arr.push(arrayFromInterval(start, end))
    }
    return arr.flat()
}

const isMovementAllowed = (num) =>{
    const {corners, sides, center} = organizedPieces
    const width = 4
    if(corners.includes(num)){
        switch(num){
            case corners[0]:
                if(emptyCell === num + 1 || emptyCell === num + width) return true
            case corners[1]:
                if(emptyCell === num - 1 || emptyCell === num + width) return true
            case corners[2]:
                if(emptyCell === num - width || emptyCell === num + 1) return true
            case corners[3]:
                if(emptyCell === num - width || emptyCell === num - 1) return true
        }
    }else if(sides.flat().includes(num)){
        if(sides[0].includes(num)){
            if(emptyCell === num - 1 || emptyCell === num + 1 || emptyCell === num + width) return true
        }else if(sides[1].includes(num)){
            if(emptyCell === num - width || emptyCell === num + 1 || emptyCell === num + width) return true
        }else if(sides[2].includes(num)){
            if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + width) return true
        }else if(sides[3].includes(num)){
            if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + 1) return true
        }
    }else if(center.includes(num)){
        if(emptyCell === num - width || emptyCell === num - 1 || emptyCell === num + 1 || emptyCell === num + width) return true
    }
}