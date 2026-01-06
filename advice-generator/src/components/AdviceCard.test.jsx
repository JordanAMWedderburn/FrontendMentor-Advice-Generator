import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AdviceCard from "./AdviceCard"

const mockAdvices = [
  { slip: { id: 1, advice: "First advice." } },
  { slip: { id: 2, advice: "Second advice." } },
  { slip: { id: 3, advice: "Third advice." } }
]

beforeEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()

  let callCount = 0

  vi.spyOn(globalThis, "fetch").mockImplementation(() => {
    const response = mockAdvices[callCount]
    callCount++

    return Promise.resolve({
      json: () => Promise.resolve(response)
    })
  })
})

describe("AdviceCard (cached + prefetching)", () => {
  it("renders fallback advice immediately", () => {
    render(<AdviceCard />)

    expect(
      screen.getByText(/good things take time/i)
    ).toBeInTheDocument()
  })

  it("replaces fallback advice with fetched advice", async () => {
    render(<AdviceCard />)

    expect(
      await screen.findByText(/first advice/i)
    ).toBeInTheDocument()
  })

  it("fetches twice on mount (current + prefetched)", async () => {
    render(<AdviceCard />)

    await screen.findByText(/first advice/i)

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it("instantly swaps advice on dice click", async () => {
    render(<AdviceCard />)

    await screen.findByText(/first advice/i)

    await userEvent.click(screen.getByRole("button"))

    expect(
      await screen.findByText(/second advice/i)
    ).toBeInTheDocument()
  })

  it("fetches new advice in the background after click", async () => {
    render(<AdviceCard />)

    await screen.findByText(/first advice/i)
    await userEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3)
    })
  })

  it("stores advice in localStorage", async () => {
    render(<AdviceCard />)

    await screen.findByText(/first advice/i)

    const stored = JSON.parse(
      localStorage.getItem("cachedAdvice")
    )

    expect(stored.advice).toBe("First advice.")
  })

  it("shows cached advice immediately on reload", async () => {
    localStorage.setItem(
      "cachedAdvice",
      JSON.stringify({ id: 99, advice: "Cached wisdom." })
    )

    render(<AdviceCard />)

    expect(
      screen.getByText(/cached wisdom/i)
    ).toBeInTheDocument()
  })

  it("shows error message if background fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    render(<AdviceCard />)

    expect(
      await screen.findByText(/network is slow/i)
    ).toBeInTheDocument()
  })
})
