import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckIn } from "./CheckIn";

afterEach(() => { cleanup(); vi.useRealTimers(); });
const callbacks = () => ({ onClose: vi.fn(), onOpenHelp: vi.fn(), onOpenBreathing: vi.fn(), playSound: vi.fn() });
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));
function start() {
  fireEvent.click(screen.getByRole("checkbox"));
  click("Empezar mi check-in");
}
function toSafety(high = false) {
  start(); click("No, estoy a salvo");
  click(high ? /Es demasiado/ : /Casi nada/);
  click(high ? /Por completo/ : /^Poco/);
}

describe("Check-in demonstration journey", () => {
  it("requires consent, focuses questions, supports back and offers help at every step", () => {
    const props = callbacks(); render(<CheckIn open {...props} />);
    expect(screen.getByRole("button", { name: "Empezar mi check-in" })).toBeDisabled();
    start(); expect(screen.getByRole("heading")).toHaveFocus();
    click("No, estoy a salvo");
    expect(screen.getByRole("heading")).toHaveTextContent("qué tan intenso");
    click("Volver a la pregunta anterior");
    expect(screen.getByRole("heading")).toHaveTextContent("peligro ahora");
    click("Ayuda ahora"); expect(props.onOpenHelp).toHaveBeenCalledOnce();
    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it("resets consent and answers on immediate close and reopen without a delayed reset", () => {
    vi.useFakeTimers();
    const props = callbacks(); const { rerender } = render(<CheckIn open {...props} />);
    start(); click("Sí, necesito ayuda ahora"); click("Cerrar check-in");
    rerender(<CheckIn open={false} {...props} />);
    rerender(<CheckIn open {...props} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    start(); click("No, estoy a salvo");
    vi.advanceTimersByTime(300);
    expect(screen.getByRole("heading")).toHaveTextContent("qué tan intenso");
  });

  it.each(["danger", "now"])("interrupts the flow for %s and renders callable emergency links", (route) => {
    render(<CheckIn open {...callbacks()} />);
    if (route === "danger") { start(); click("Sí, necesito ayuda ahora"); }
    else { toSafety(); click("Sí, ahora"); }
    expect(screen.getByRole("heading")).toHaveTextContent("Tu seguridad es lo primero");
    expect(screen.getByRole("link", { name: "Llamar al 911" })).toHaveAttribute("href", "tel:911");
    expect(screen.queryByText("¿Hay alguien con quien puedas hablar hoy?")).not.toBeInTheDocument();
  });

  it("routes high distress to support and opens the help panel", () => {
    const props = callbacks(); render(<CheckIn open {...props} />);
    toSafety(true); click("No"); click("No tengo a quién");
    expect(screen.getByRole("heading")).toHaveTextContent("apoyo humano hoy");
    click("Ver opciones de apoyo"); expect(props.onOpenHelp).toHaveBeenCalledOnce();
  });

  it("keeps the documented sometimes behavior, neutral wording and access to support", () => {
    const props = callbacks(); render(<CheckIn open {...props} />);
    toSafety(); click("Me ha pasado, pero no ahora"); click("Sí, sé con quién");
    expect(screen.getByRole("heading")).toHaveTextContent("No tienes que resolverlo todo hoy");
    expect(screen.queryByText(/parece manejable/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver opciones de apoyo" })).toBeInTheDocument();
    click("Hacer una pausa guiada"); expect(props.onOpenBreathing).toHaveBeenCalledOnce();
  });

  it("can repeat a completed check-in with fresh consent", () => {
    render(<CheckIn open {...callbacks()} />);
    toSafety(); click("No"); click("Sí, sé con quién"); click("Repetir check-in");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Empezar mi check-in" })).toBeDisabled();
  });
});
