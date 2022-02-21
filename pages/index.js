let options = document.getElementById('options') ;
let activatedoption ;
let optedstream ;
let optionsdisabled = false ;
let timerset = false ;
let score = 0 ;
let dscore ;

options.addEventListener('click', (e) => {
    if(activatedoption) {
    activatedoption.style.backgroundColor = "white" ;
    activatedoption.style.color = "black" ;
    }
    e.target.style.backgroundColor = '#161c2d' ;
    e.target.style.color ="white" ;
    activatedoption = e.target ;
    optedstream = e.target.id ;
})

let proceedbutton = document.getElementById('proceedbutton') ;

proceedbutton.addEventListener('click', () => {
    if(!optedstream) {
        if(!document.getElementById('insertedmessage')) {
        let p = document.createElement('p') ;
        p.innerHTML = "<b>please select any of the fields<b>" ;
        p.className = "mx-auto mt-2" ;
        p.id = "insertedmessage" ;
        document.getElementById('proceedblock').appendChild(p) ;
        }
        return ;
    }
    document.getElementById('proceedblock').className = "d-none" ;
    let xhr = new XMLHttpRequest() ;
    xhr.open('GET',`https://exam-que-api.herokuapp.com/${optedstream}`, true) ;
    // xhr.open('GET',`http://localhost:3000/${optedstream}`, true) ;
    xhr.send() ;
    xhr.onload = () => {
        if(xhr.status === 200) {
            let data = xhr.responseText ;
            data = JSON.parse(data) ;
            displayfirstdata(data) ;
        }
        else
        console.log(error) ;
    }
})

function displayfirstdata(data) {
    document.getElementById('problemstatement').innerText = data.statement ;
    options.remove() ;
    let ul = document.createElement('ul') ;
    ul.className = "list-group" ;
    ul.id = "questionoptions" ;
    let li1 = document.createElement('li') ;
    li1.className = "list-group-item" ;
    li1.innerHTML = data.option1 ;
    li1.id = 'A' ;
    let li2 = document.createElement('li') ;
    li2.className = "list-group-item" ;
    li2.id = 'B' ;
    li2.innerText = data.option2 ;
    let li3 = document.createElement('li') ;
    li3.className = "list-group-item" ;
    li3.id = 'C' ;
    li3.innerText = data.option3 ;
    let li4 = document.createElement('li') ;
    li4.className = "list-group-item" ;
    li4.id = 'D' ;
    li4.innerText = data.option4 ;
    let a = document.getElementById('questionblock') ;
    ul.appendChild(li1) ;
    ul.appendChild(li2) ;
    ul.appendChild(li3) ;
    ul.appendChild(li4) ;
    a.appendChild(ul) ;
    if(!timerset) {
    dscore = document.getElementById('score') ;
    settimer() ;
    timerset = true ;
    document.getElementById('timerandscore').className = "d-flex flex-row justify-content-between mb-3" ;
    }
    optionsdisabled = false ;
    processing(data) ;
}

function processing(data) {
    var questionoptions = document.getElementById('questionoptions') ;
    questionoptions.addEventListener('click', (e) => {
        if(!optionsdisabled) {
            optionsdisabled = true ;
        if(e.target.id == data.answer) {
            score = score + 100 ;
            e.target.className = e.target.className + " bg-dark text-light" ;
        }
        else {
            score = score - 25 ;
        var children = questionoptions.children ;
        for(let child of children) {
            if(child.id == `${data.answer}`)
            child.className = child.className + " bg-dark text-light" ;
            else
            child.className = child.className + " bg-secondary text-light" ;
        }}
        dscore.innerText = `Score : ${score}` ;
        let xhr = new XMLHttpRequest() ;
        xhr.open('GET',`https://exam-que-api.herokuapp.com/${optedstream}`, true) ;
        xhr.send() ;
        xhr.onload = () => {
            let data = xhr.responseText ;
            data = JSON.parse(data) ;
            document.getElementById('questionoptions').remove() ;
            displayfirstdata(data) ;
        }
        }})
}

function settimer() {
    let minutes = 1 ;
    let seconds = 59 ;
    let dminutes = document.getElementById('minutes') ;
    let dseconds = document.getElementById('seconds') ;
    let intId = setInterval(() => {
        if(seconds == 0 && minutes == 0) {
            clearInterval(intId) ;
            let body = document.getElementsByTagName('body') ;
            body[0].innerHTML = '' ;
            let h2 = document.createElement('h2') ;
            h2.innerText = `Your score : ${score}` ;
            h2.className = 'text-center mt-3' ;
            body[0].appendChild(h2) ;
            body[0].className = "d-flex flex-column" ;
            let div = document.createElement('div') ;
            div.className = "mx-auto" ;
            let button = document.createElement('a') ;
            button.className = "btn btn-dark mx-auto" ;
            button.href = '../index.html' ;
            button.innerText = "Try again" ;
            div.appendChild(button) ;
            body[0].appendChild(div) ;
        }
        if(seconds == 0) {
            seconds = 59 ;
            minutes = minutes-1 ;
        }
        dminutes.innerText = `0${minutes}` ;
        if(seconds > 9)
        dseconds.innerText = seconds ;
        else 
        dseconds.innerText = `0${seconds}` ;
        seconds = seconds-1 ;
    },1000) ;
}

