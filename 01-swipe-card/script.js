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
  },
  {
    name: "성진",
    age: "22",
    image: "/01-swipe-card/photos/4.webp",
    alt: "성진, brown hair man, 22 years old"
  },
  {
    name: "Imari",
    age: 23,
    image: "/01-swipe-card/photos/5.webp",
    alt: "Imari, black hair girl, 23 years old"
  },
  {
    name: "Yan",
    age: 23,
    image: "/01-swipe-card/photos/6.webp",
    alt: "Yan, black hair girl, 23 years old"
  },
  {
    name: "Hui",
    age: 23,
    image: "/01-swipe-card/photos/7.webp",
    alt: "Hui, black hair girl, 23 years old"
  },
  {
    name: "Sumie",
    age: 23,
    image: "/01-swipe-card/photos/8.webp",
    alt: "Sumie, black hair girl, 23 years old"
  },
  {
    name: "Hanako",
    age: 23,
    image: "/01-swipe-card/photos/9.webp",
    alt: "Hanako, black hair girl, 23 years old"
  },
  {
    name: "Rona",
    age: 23,
    image: "/01-swipe-card/photos/10.webp",
    alt: "Rona, black hair girl, 23 years old"
  },
  {
    name: "Mitoki",
    age: 23,
    image: "/01-swipe-card/photos/11.webp",
    alt: "Mitoki, black hair girl, 23 years old"
  },
  {
    name: "Asumi",
    age: 23,
    image: "/01-swipe-card/photos/12.webp",
    alt: "Asumi, black hair girl, 23 years old"
  },
  {
    name: "Chieka",
    age: 23,
    image: "/01-swipe-card/photos/13.webp",
    alt: "Chieka, black hair girl, 23 years old"
  },
  {
    name: "Miko",
    age: 23,
    image: "/01-swipe-card/photos/14.webp",
    alt: "Miko, black hair girl, 23 years old"
  },
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
  const animation = document.querySelector(".reload-animation")

  if (!animation) {
    $reloadButton.classList.add("reload-animation")

    // Trigger reflow
    $reloadButton.offsetHeight;

    // Remove existing cards
    $cardContainer.innerHTML = `
    <span class="back">¡Vaya, no hay más personas por mostrar!</span>
    `

    // Render new set of cards
    cardsRender();

    setTimeout(() => {
      // Remove animation class after cards are rendered
      $reloadButton.classList.remove("reload-animation")
    }, 600);
  }
}

cardsRender()

document.addEventListener("mousedown", startDrag)
document.addEventListener("touchstart", startDrag, { passive: true })
$reloadButton.addEventListener("click", reload)
