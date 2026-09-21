export const sounds = [
  { id: "ambiente-suave", name: "Ambiente suave", detail: "Notas cálidas y sostenidas", type: "Música" },
  { id: "lluvia", name: "Lluvia ligera", detail: "Un murmullo de gotas constante", type: "Naturaleza" },
  { id: "oleaje", name: "Oleaje tranquilo", detail: "Olas que llegan y se alejan", type: "Naturaleza" },
  { id: "brisa", name: "Brisa entre hojas", detail: "Aire suave en movimiento", type: "Naturaleza" },
  { id: "ruido-marron", name: "Ruido marrón", detail: "Una textura grave y uniforme", type: "Textura" },
  { id: "campanas", name: "Campanas suaves", detail: "Notas espaciadas que se desvanecen", type: "Música" },
] as const;

export type SoundId = typeof sounds[number]["id"];
export const soundSource = (id: SoundId) => `/audio/${id}.mp3`;
