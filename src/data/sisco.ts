// Wording supplied in the Euler prototype; clinical review is pending.
export const siscoItems = [
  {
    id: "E1",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa la sobrecarga de tareas y trabajos escolares que tienes que realizar todos los días?",
  },
  {
    id: "E2",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa la personalidad y el carácter de los profesores que te imparten clases?",
  },
  {
    id: "E3",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa la forma en que tus profesores te evalúan, por ejemplo mediante ensayos, trabajos de investigación o búsquedas en Internet?",
  },
  {
    id: "E4",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa el nivel de exigencia de tus profesores?",
  },
  {
    id: "E5",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa el tipo de trabajo que te piden tus profesores, como consultas, ensayos, fichas de trabajo o mapas conceptuales?",
  },
  {
    id: "E6",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa tener tiempo limitado para hacer el trabajo que te encargan tus profesores?",
  },
  {
    id: "E7",
    dimension: "stressors",
    question:
      "¿Con qué frecuencia te estresa tener poca claridad sobre lo que tus profesores esperan de ti?",
  },
  {
    id: "S1",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia sientes fatiga o cansancio permanente?",
  },
  {
    id: "S2",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia aparecen sentimientos de tristeza o decaimiento?",
  },
  {
    id: "S3",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia sientes ansiedad, angustia o desesperación?",
  },
  {
    id: "S4",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia tienes problemas para concentrarte?",
  },
  {
    id: "S5",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia notas que aumenta tu irritabilidad o agresividad?",
  },
  {
    id: "S6",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia tiendes a discutir o entrar en conflictos?",
  },
  {
    id: "S7",
    dimension: "symptoms",
    question:
      "Cuando estás estresado/a, ¿con qué frecuencia sientes desgano para realizar tus actividades escolares?",
  },
  {
    id: "A1",
    dimension: "coping",
    question:
      "¿Con qué frecuencia te concentras en resolver la situación que te preocupa?",
  },
  {
    id: "A2",
    dimension: "coping",
    question:
      "¿Con qué frecuencia estableces soluciones concretas para resolver la situación que te preocupa?",
  },
  {
    id: "A3",
    dimension: "coping",
    question:
      "¿Con qué frecuencia analizas lo positivo y lo negativo de las soluciones que has pensado?",
  },
  {
    id: "A4",
    dimension: "coping",
    question:
      "¿Con qué frecuencia intentas mantener el control sobre tus emociones para que no te afecte lo que te estresa?",
  },
  {
    id: "A5",
    dimension: "coping",
    question:
      "¿Con qué frecuencia recuerdas situaciones parecidas que hayas vivido y piensas en cómo las resolviste?",
  },
  {
    id: "A6",
    dimension: "coping",
    question:
      "¿Con qué frecuencia haces un plan para enfrentar lo que te estresa y llevas a cabo sus pasos?",
  },
  {
    id: "A7",
    dimension: "coping",
    question:
      "¿Con qué frecuencia intentas encontrar algo positivo en la situación que te preocupa?",
  },
] as const;

export const frequencyLabels = [
  "Nunca",
  "Casi nunca",
  "Raras veces",
  "Algunas veces",
  "Casi siempre",
  "Siempre",
] as const;
