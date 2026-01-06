import { useEffect, useState, useCallback, useRef } from "react"
import dividerDesktop from "../assets/images/pattern-divider-desktop.svg"
import dividerMobile from "../assets/images/pattern-divider-mobile.svg"
import diceIcon from "../assets/images/icon-dice.svg"

const API_URL = "https://api.adviceslip.com/advice"
const STORAGE_KEY = "cachedAdvice"

const FALLBACK_ADVICE = {
  id: 0,
  advice: "Good things take time — but apps shouldn’t."
}

const LOADING_ADVICE = {
  id: null,
  advice: "Loading"
}

function AdviceCard() {
  const [currentAdvice, setCurrentAdvice] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY)
    return cached ? JSON.parse(cached) : FALLBACK_ADVICE
  })

  const [nextAdvice, setNextAdvice] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  // 🔒 hard lock to prevent overlapping clicks
  const isLockedRef = useRef(false)

  const fetchAdvice = async () => {
    const res = await fetch(API_URL, { cache: "no-store" })
    const data = await res.json()
    return data.slip
  }

  // Initial hydration + prefetch
  useEffect(() => {
    const hydrate = async () => {
      try {
        const first = await fetchAdvice()
        setCurrentAdvice(first)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(first))

        const second = await fetchAdvice()
        setNextAdvice(second)
      } catch {
        setError(true)
      }
    }

    hydrate()
  }, [])

const handleClick = useCallback(async () => {
  if (isLockedRef.current) return

  isLockedRef.current = true
  setIsLoading(true)
  setCurrentAdvice(LOADING_ADVICE)

  const unlockTimeout = setTimeout(() => {
    isLockedRef.current = false
    setIsLoading(false)
  }, 3000)

  try {
    // 🔒 SNAPSHOT advice ONCE
    const adviceSnapshot =
      nextAdvice ?? (await fetchAdvice())

    // UX loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // ✅ SINGLE render point
    setCurrentAdvice(adviceSnapshot)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(adviceSnapshot)
    )

    // Refill buffer AFTER render
    fetchAdvice()
      .then(fresh => setNextAdvice(fresh))
      .catch(() => setError(true))
  } catch {
    setError(true)
    setCurrentAdvice(FALLBACK_ADVICE)
  } finally {
    clearTimeout(unlockTimeout)
    isLockedRef.current = false
    setIsLoading(false)
  }
}, [nextAdvice])

  const isShowingLoading = currentAdvice.id === null

  return (
    <div className="card">
      <p className="advice-id">
        {isShowingLoading ? "ADVICE" : `ADVICE #${currentAdvice.id}`}
      </p>

      <h1 className="advice-text">
        {isShowingLoading
          ? currentAdvice.advice
          : `“${currentAdvice.advice}”`}
      </h1>

      <picture>
        <source media="(min-width: 768px)" srcSet={dividerDesktop} />
        <img src={dividerMobile} alt="" />
      </picture>

      <button
        className="dice-button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Generate new advice"
        aria-busy={isLoading}
      >
        <img src={diceIcon} alt="" />
      </button>

      {error && (
        <p className="error">
          Network is slow — showing saved advice.
        </p>
      )}
    </div>
  )
}

export default AdviceCard