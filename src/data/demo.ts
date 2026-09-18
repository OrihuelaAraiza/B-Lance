// Presentation fixtures only. Never derive these values from check-in answers.
import { Brain, Heart, Home, School, UsersRound } from "lucide-react";

export const spheres = [
  {
    key: "mente",
    label: "Mi mente no para",
    response: "Vamos a bajar el volumen, una pregunta a la vez.",
    Icon: Brain,
  },
  {
    key: "cuerpo",
    label: "Lo siento en el cuerpo",
    response: "Primero ubicamos la sensación. No tienes que pelear con ella.",
    Icon: Heart,
  },
  {
    key: "escuela",
    label: "Escuela o trabajo",
    response: "Podemos separar lo urgente de lo que puede esperar.",
    Icon: School,
  },
  {
    key: "casa",
    label: "Algo en casa",
    response: "Este es un espacio para ordenar lo que está pasando, sin juicios.",
    Icon: Home,
  },
  {
    key: "relaciones",
    label: "Una relación",
    response: "Vamos a entender qué necesitas para recuperar un poco de seguridad.",
    Icon: UsersRound,
  },
];

export const supportPaths = [
  { number: "01", title: "Te escucha", text: "Mensajes breves, lenguaje cercano y sin interrogatorios.", color: "pink" },
  { number: "02", title: "Te ayuda a ubicarlo", text: "Un check-in rápido reconoce la intensidad, el impacto y la seguridad.", color: "lilac" },
  { number: "03", title: "Te da una salida", text: "Una pausa guiada, una persona de confianza o ayuda inmediata.", color: "mint" },
];

export const demoViews = {
  esferas: [
    { label: "Académica", value: 68, color: "var(--coral)" },
    { label: "Individual", value: 52, color: "var(--lilac)" },
    { label: "Familiar", value: 31, color: "var(--mint-deep)" },
    { label: "Social", value: 24, color: "var(--yellow-deep)" },
  ],
  tendencia: [
    { label: "Semana 1", value: 35, color: "var(--lilac)" },
    { label: "Semana 2", value: 47, color: "var(--lilac)" },
    { label: "Semana 3", value: 42, color: "var(--lilac)" },
    { label: "Semana 4", value: 58, color: "var(--lilac)" },
  ],
};

