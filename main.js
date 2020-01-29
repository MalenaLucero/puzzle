const originalOrder = ['0% 0%','33.3% 0%', '66.6% 0%', '100% 0%',
                '0% 33.3%', '33.3% 33.3%', '66.6% 33.3%', '100% 33.3%',
                '0% 66.6%', '33.3% 66.6%', '66.6% 66.6%', '100% 66.6%',
                '0% 100%', '33.3% 100%', '66.6% 100%', '']
const cells = [...Array(16).keys()]                
const imageUrl = 'url("images/monks.jpg")'
let emptyCell

const initialize = () =>{
    //random number from 0 to 15
    emptyCell = Math.floor(Math.random() * 16)
    console.log('empty: ' + emptyCell)

    const shuffledOrder = shuffle([...originalOrder])
    console.log(shuffledOrder)
    arraymove(shuffledOrder, shuffledOrder.indexOf(''), emptyCell)
    console.log(shuffledOrder)

    shuffledOrder.forEach((position, index)=>{
        const piece = document.getElementById(`piece${index}`)
        if(position !== ''){
            piece.style.backgroundImage = imageUrl
            piece.style.backgroundPosition = position
        }
    })
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