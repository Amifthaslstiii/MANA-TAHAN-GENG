

const basket = document.getElementById("basket")
const gameArea = document.getElementById("gameArea")

const scoreEl = document.getElementById("score")
const targetEl = document.getElementById("target")
const alienEl = document.getElementById("alienCount")

const pauseBtn = document.getElementById("pauseBtn")
const continueBtn = document.getElementById("continueBtn")
const restartBtn = document.getElementById("restartBtn")

const pauseScreen = document.getElementById("pauseScreen")
const endScreen = document.getElementById("endScreen")
const endMessage = document.getElementById("endMessage")

const wrongSound = document.getElementById("wrongSound")
const winSound = document.getElementById("winSound")
const loseSound = document.getElementById("loseSound")
const bgm = document.getElementById("bgm")

const jumpscareSound = document.getElementById("jumpscareSound")

const jumpscareScreen = document.getElementById("jumpscareScreen")
const flash = document.getElementById("flashRed")


const slides = document.querySelectorAll(".introSlide")
const skipBtn = document.getElementById("skipSlide")
const introScreen = document.getElementById("introScreen")

/* sound intro */

const introSound = new Audio("introSound.mp3")
introSound.loop = true

const skipSound = new Audio("skip.mp3")



let score = 0
let alienCount = 0
let target = Math.floor(Math.random()*21)+10

let gameRunning = false
let paused = false
let speed = 2
let spawnInterval = null

targetEl.textContent = target



let currentSlide = 0
let slideTimer = null

function startIntro(){

introSound.currentTime = 0
introSound.play().catch(()=>{})

slideTimer = setInterval(nextSlide,20000)

}

function nextSlide(){

slides[currentSlide].classList.remove("active")

currentSlide++

if(currentSlide >= slides.length){

clearInterval(slideTimer)

introSound.pause()

introScreen.style.display = "none"

startGame()

return
}

slides[currentSlide].classList.add("active")

}

skipBtn.addEventListener("click",()=>{

skipSound.currentTime = 0
skipSound.play().catch(()=>{})

nextSlide()

})

startIntro()



const animals=[
"piqram.png",
"lulu.png",
"paso.png",
"muti.png",
"ule.png",
"ara.png",
"dindoy.png"
]

function spawnAnimal(){

if(!gameRunning || paused) return

const img=document.createElement("img")
img.classList.add("animal")

const isAlien = Math.random() < 0.2

img.src = isAlien ? "apla.png" : animals[Math.floor(Math.random()*animals.length)]

img.dataset.type = isAlien ? "alien" : "animal"

img.style.left = Math.random()*(window.innerWidth-80)+"px"
img.style.top = "-80px"

gameArea.appendChild(img)

let fall = setInterval(()=>{

if(paused){
clearInterval(fall)
return
}

img.style.top = img.offsetTop + speed + "px"

if(img.offsetTop > window.innerHeight){

img.remove()
clearInterval(fall)

}

checkCatch(img,fall)

},20)

}



function checkCatch(img,fall){

const basketRect = basket.getBoundingClientRect()
const imgRect = img.getBoundingClientRect()

if(
imgRect.bottom >= basketRect.top &&
imgRect.left < basketRect.right &&
imgRect.right > basketRect.left
){

clearInterval(fall)
img.remove()



if(img.dataset.type === "alien"){

alienCount++
alienEl.textContent = alienCount

wrongSound.currentTime = 0
wrongSound.play().catch(()=>{})



basket.style.opacity = "0.2"
setTimeout(()=>{
basket.style.opacity = "1"
},150)

if(alienCount >= 5){

endGame(false)

}

}


else{

score++
scoreEl.textContent = score

speed += 0.2

if(score >= target){

endGame(true)

}

}

}

}



function startGame(){

gameRunning = true

bgm.currentTime = 0
bgm.play().catch(()=>{})

spawnInterval = setInterval(spawnAnimal,1000)

}



function endGame(win){

gameRunning = false

clearInterval(spawnInterval)

document.querySelectorAll(".animal").forEach(e=>e.remove())

bgm.pause()

if(win){

winSound.currentTime = 0
winSound.play().catch(()=>{})

endScreen.classList.remove("hidden")
endMessage.textContent = "MISSION SUCCESS"

}

else{

flashRed()

setTimeout(()=>{

jumpscare()

},400)

}

}



function flashRed(){

flash.style.opacity = "1"

setTimeout(()=>{
flash.style.opacity = "0"
},200)

}



function jumpscare(){

jumpscareScreen.style.display = "flex"

jumpscareSound.currentTime = 0
jumpscareSound.play().catch(()=>{})

setTimeout(()=>{

jumpscareScreen.style.display = "none"

loseSound.currentTime = 0
loseSound.play().catch(()=>{})

endScreen.classList.remove("hidden")
endMessage.textContent = "GAME OVER"

},8000)

}

/* =========================
   CONTROLS
========================= */

pauseBtn.onclick=()=>{

if(!gameRunning) return

paused = true

clearInterval(spawnInterval)

pauseScreen.classList.remove("hidden")

}

continueBtn.onclick=()=>{

paused = false

pauseScreen.classList.add("hidden")

spawnInterval = setInterval(spawnAnimal,1000)

}



restartBtn.addEventListener("click",()=>{

location.reload()

})



document.addEventListener("mousemove",e=>{

if(!gameRunning || paused) return

basket.style.left = e.clientX - basket.offsetWidth/2 + "px"

})



document.addEventListener("touchmove",e=>{

if(!gameRunning || paused) return

e.preventDefault()

basket.style.left = e.touches[0].clientX - basket.offsetWidth/2 + "px"

},{passive:false})

