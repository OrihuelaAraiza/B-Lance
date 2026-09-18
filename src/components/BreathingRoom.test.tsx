import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BreathingRoom } from "./BreathingRoom";

beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date", "performance"] }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

describe("Guided breathing", () => {
  it("shares phase and visual time, preserves partial seconds on pause, and ends at 50 seconds", () => {
    render(<BreathingRoom open onClose={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent("lista para empezar");
    click("Empezar"); advance(2500);
    expect(screen.getByRole("status")).toHaveTextContent("Inhala");
    const halo = document.querySelector<HTMLElement>(".breath-orbit__halo")!;
    const transform = halo.style.transform;
    click("Pausar"); advance(8000);
    expect(halo.style.transform).toBe(transform);
    expect(screen.getByText("2 / 50 s")).toBeInTheDocument();
    click("Continuar"); advance(1500);
    expect(screen.getByRole("status")).toHaveTextContent("Suelta");
    advance(46000);
    expect(screen.getByRole("status")).toHaveTextContent("Pausa terminada");
    expect(screen.getByText("50 / 50 s")).toBeInTheDocument();
    advance(2000); expect(screen.getByText("50 / 50 s")).toBeInTheDocument();
    click("Repetir la pausa"); expect(screen.getByText("0 / 50 s")).toBeInTheDocument();
  });

  it("pauses on hidden tab, does not auto-resume and resets on close", () => {
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const { rerender } = render(<BreathingRoom open onClose={vi.fn()} />);
    click("Empezar"); advance(3000);
    hidden.mockReturnValue(true);
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    advance(6000); expect(screen.getByText("3 / 50 s")).toBeInTheDocument();
    hidden.mockReturnValue(false);
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
    click("Continuar"); advance(1000); expect(screen.getByText("4 / 50 s")).toBeInTheDocument();
    rerender(<BreathingRoom open={false} onClose={vi.fn()} />);
    rerender(<BreathingRoom open onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Empezar" })).toBeInTheDocument();
    expect(screen.getByText("0 / 50 s")).toBeInTheDocument();
  });
});
