const imageUrlDesktop = 'url("images/monks500px.jpg")'
const imageUrlMobile = 'url("images/monks350px.jpg")'
let originalOrder = []
let emptyCell
let shuffledOrder = []
let organizedPieces = {}
let width = 4
let height = 4

const initialize = () =>{
    fillOriginalOrder()

    //hide 'Congratuilations!' message
    const winningMessage = document.getElementById('winningMessage')
    winningMessage.classList.replace('show', 'hide')

    //separates pieces in three groups: corners, sides, center
    organizePieces()

    //random number. This is the white tile
    emptyCell = Math.floor(Math.random() * originalOrder.length)

    //shuffles the original order of the tiles
    shuffledOrder = shuffle([...originalOrder])

    //moves -1 to the emptyCell index in shuffledOrder array
    arraymove(shuffledOrder, shuffledOrder.indexOf(-1), emptyCell)

    //each tile is given a portion of the main picture as background, except the white tile
    const puzzleContainer = document.getElementById('puzzle-container')
    puzzleContainer.innerHTML = ''
    shuffledOrder.forEach((position, index)=>{
        const piece = document.createElement('div')
        piece.id = `piece${index}`
        piece.onclick = () => movePiece(index)
        if(position !== -1){
            piece.style.backgroundPosition = position
            if(window.innerWidth < 600){
                piece.style.backgroundImage = imageUrlMobile
            }else{
                piece.style.backgroundImage = imageUrlDesktop
            }
        }else{
            piece.style.backgroundImage = ''
        }
        puzzleContainer.appendChild(piece)
    })
}

//show the fulls picture with an empty cell at the end
const showPicture = () =>{
    shuffledOrder = [...originalOrder]
    emptyCell = originalOrder.length
    shuffledOrder.forEach((position, index)=>{
        const piece = document.getElementById(`piece${index}`)
        piece.onclick = ''
        if(position !== -1){
            piece.style.backgroundPosition = position
            if(window.innerWidth < 600){
                piece.style.backgroundImage = imageUrlMobile
            }else{
                piece.style.backgroundImage = imageUrlDesktop
            }
        }else{
            piece.style.backgroundImage = ''
        }
    })

}

const getInputByUser = () =>{
    const inputWidth = document.getElementById('width')
    const inputHeight = document.getElementById('height')
    if(parseInt(inputWidth.value) > 2 && parseInt(inputHeight.value) > 2){
        width = parseInt(inputWidth.value)
        height = parseInt(inputHeight.value)
        inputWidth.value = ''
        inputHeight.value = ''
        const puzzleContainer = document.getElementById('puzzle-container')
        puzzleContainer.style.gridTemplateColumns = `repeat(${width}, auto)`
        puzzleContainer.style.gridTemplateRows = `repeat(${height}, auto)`
        initialize()
    }
}

const fillOriginalOrder = () =>{
    //porcentages of the columns
    const widthValues = []
    for(let i=0; i < width ; i++){
        let value = 100/(width-1)*i
        if(Number.isInteger(value)){
            widthValues.push(`${value.toFixed()}%`)
        }else{
            widthValues.push(`${value.toFixed(2)}%`)
        }
    }
    
    //porcentages of the rows
    const heightValues = []
    for(let i=0; i < height ; i++){
        let value = 100/(height-1)*i
        if(Number.isInteger(value)){
            heightValues.push(`${value.toFixed()}%`)
        }else{
            heightValues.push(`${value.toFixed(2)}%`)
        }
    }
    
    //combination of the two porcentages in one array
    originalOrder = heightValues.map(height=>{
        const arr = []
        widthValues.forEach(width=>{
            arr.push(`${width} ${height}`)
        })
        return arr
    }).flat()

    //the last element is maked with -1 (the white tile)
    originalOrder[originalOrder.length - 1 ] = -1
}

//onclick of each tile. 'num' is the number of the tile
const movePiece = num =>{
    const clickedPiece = document.getElementById(`piece${num}`)
    
    if(isMovementAllowed(num) && !isSameArray()){
        //the clicked tile becomes white
        clickedPiece.style.backgroundImage = ''
        //the previous white tile gets an image
        const emptyPiece = document.getElementById(`piece${emptyCell}`)
        if(window.innerWidth < 600){
            emptyPiece.style.backgroundImage = imageUrlMobile
        }else{
            emptyPiece.style.backgroundImage = imageUrlDesktop
        }
        emptyPiece.style.backgroundPosition = clickedPiece.style.backgroundPosition
        //the number of the clicked tile becomes the empty cell
        emptyCell = num 
        //the porcentages change order in the shuffled array
        arraymove(shuffledOrder,shuffledOrder.indexOf(clickedPiece.style.backgroundPosition), shuffledOrder.indexOf(-1))
        //the '' element goes to the empty cell index
        arraymove(shuffledOrder, shuffledOrder.indexOf(-1), emptyCell)

        console.log(shuffledOrder)
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

//switches two elements in an array
//I took this function from Stackoverflow
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

//compares the original array with the rearranged array
const isSameArray = () =>{
    const sharedValues = originalOrder.filter((value, index)=>{
            if(value === shuffledOrder[index]) return value
    })
    if(sharedValues.length === originalOrder.length) return true
}

const organizePieces = () =>{
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

//from an interval of integers, it returns an array
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