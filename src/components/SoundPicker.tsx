import { useEffect, useRef } from "react";
import { AudioLines, CloudRain, Music2, Waves, Wind, Bell } from "lucide-react";
import { sounds, type SoundId } from "../data/sounds";

const icons = [Music2, CloudRain, Waves, Wind, AudioLines, Bell];

export function SoundPicker({ selected, onSelect }: { selected: SoundId; onSelect: (id: SoundId) => void }) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && details.current && !details.current.contains(event.target)) {
        details.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details ref={details} className="sound-picker" onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (details.current) details.current.open = false;
        summary.current?.focus();
      }
    }}>
      <summary ref={summary} aria-label="Elegir ambiente relajante" title="Elegir ambiente relajante">
        <AudioLines aria-hidden="true" />
      </summary>
      <div className="sound-picker__panel">
        <fieldset>
          <legend>Tu ambiente</legend>
          <p>Elige un sonido y actívalo cuando quieras.</p>
          {sounds.map((sound, index) => {
            const Icon = icons[index];
            return (
              <label className="sound-picker__option" key={sound.id}>
                <input type="radio" name="ambient-sound" value={sound.id} checked={selected === sound.id} onChange={() => onSelect(sound.id)} />
                <Icon aria-hidden="true" />
                <span><strong>{sound.name}</strong><small>{sound.detail}</small></span>
                <span className="sr-only">{sound.type}</span>
              </label>
            );
          })}
        </fieldset>
      </div>
    </details>
  );
}
