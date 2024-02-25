const DECISION_THRESHOLD = 75
let isAnimating = false
let pullDeltaX = 0 // Card pulling distance

const data = [
  {
    name: "Pedro",
    age: 25,
    image: "/01-swipe-card/photos/2.webp",
    alt: "Pedro, brown hair man, 25 years old"
  },
  {
    name: "Samantha",
    age: 23,
    image: "/01-swipe-card/photos/1.webp",
    alt: "Samantha, redhead girl, 23 years old"
  },
  {
    name: "Lia",
    age: 26,
    image: "/01-swipe-card/photos/3.webp",
    alt: "Lia, brown hair girl, 26 years old",
  }
]

const $cardContainer = document.querySelector('.cards')
const $reloadButton = document.getElementById('reload')


const cardsRender = () => {
  data.map((card) => {
    const { name, image, alt, age } = card
    const postCard = document.createElement('article')
    postCard.classList.add('cards')
    postCard.innerHTML = `
      <img src=${image} alt=${alt} />
      <h2>${name}<span>${age}</span></h2>
      <div class="choice like">LIKE</div>
      <div class="choice nope">NOPE</div>
    `
    $cardContainer.appendChild(postCard)
  })
}

function startDrag(event) {
  if (isAnimating) return

  // get the first article element
  const actualCard = event.target.closest("article")
  if (!actualCard) return

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX

  // listen the mouse and touch movements
  document.addEventListener("mousemove", onMove)
  document.addEventListener("mouseup", onEnd)

  document.addEventListener("touchmove", onMove, { passive: true })
  document.addEventListener("touchend", onEnd, { passive: true })

  function onMove(event) {
    // current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX
    // distance between the initial and current position
    pullDeltaX = currentX - startX

    // there's no move
    if (pullDeltaX === 0) return

    isAnimating = true
    // calculate rotation angle from the distance
    const angle = pullDeltaX / 10
    // show animation transform rotate and cursor
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${angle}deg)`
    actualCard.style.cursor = "grabbing"

    // change opacity of choice info
    const opacity = Math.abs(pullDeltaX) / 100
    const isRight = pullDeltaX > 0

    const choiceElement = isRight
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope")

    choiceElement.style.opacity = opacity
  }

  function onEnd(event) {
    // clear events
    document.removeEventListener("mousemove", onMove)
    document.removeEventListener("mouseup", onEnd)

    document.removeEventListener("touchmove", onMove)
    document.removeEventListener("touchend", onEnd)

    // know if the user took a decision
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

    if (decisionMade) {
      const goRight = pullDeltaX >= 0
      const goLeft = !goRight

      actualCard.classList.add(goRight ? "go-right" : "go-left")
      actualCard.addEventListener("transitionend", () => {
        actualCard.remove()
      })
    } else {
      actualCard.classList.add("reset")
      actualCard.classList.remove("go-right", "go-left")
      actualCard.querySelectorAll(".choice").forEach((element) => {
        element.style.opacity = 0
      })
    }

    // reset variables
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style")
      actualCard.classList.remove("reset")

      pullDeltaX = 0
      isAnimating = false
    })
  }
}

function reload() {
  cardsRender()
}

cardsRender()

document.addEventListener("mousedown", startDrag)
document.addEventListener("touchstart", startDrag, { passive: true })
$reloadButton.addEventListener("click", reload)
