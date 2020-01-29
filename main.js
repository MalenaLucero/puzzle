const originalOrder = ['0% 0%','33.3% 0%', '66.6% 0%', '100% 0%',
                '0% 33.3%', '33.3% 33.3%', '66.6% 33.3%', '100% 33.3%',
                '0% 66.6%', '33.3% 66.6%', '66.6% 66.6%', '100% 66.6%',
                '0% 100%', '33.3% 100%', '66.6% 100%']
const cells = [...Array(16).keys()]                
const imageUrl = 'url("images/monks.jpg")'

const initialize = () =>{
    //random number from 0 to 15
    const emptyCell = Math.floor(Math.random() * 16)
    console.log('empty: ' + emptyCell)

    const shuffledOrder = shuffle([...originalOrder])

    cells.forEach((cell,index)=>{
        const piece = document.getElementById(`piece${index+1}`)
        if(index !== emptyCell && index < 15){
            piece.style.backgroundImage = imageUrl
            piece.style.backgroundPosition = shuffledOrder[index]
            console.log(index)
            console.log(shuffledOrder[index])
        }else if(index !== emptyCell && index === 15){
            piece.style.backgroundImage = imageUrl
            piece.style.backgroundPosition = shuffledOrder[emptyCell]
        }
    })
    
}

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};