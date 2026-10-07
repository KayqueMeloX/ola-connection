export interface QuizOption {
  text: string;
  image?: string;
  emoji?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionImage?: string;
  optionStyle?: "default" | "solid";
  options: QuizOption[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Você sabe qual é o principal fundamento da religião da Umbanda?",
    options: [
      { text: "Os Orixás", image: "/assets/option-orixas-BJo4pGll.png" },
      { text: "Os Preto Velhos", image: "/assets/option-preto-velhos-CQh7x9tk.png" },
      { text: "A Caridade", image: "/assets/option-caridade-CVJE28jO.png" },
      { text: "Não tenho certeza", emoji: "🤔" },
    ],
    correctAnswer: 2,
    explanation:
      "A Caridade é o principal fundamento da Umbanda. A religião é baseada na prática do bem e no auxílio espiritual ao próximo, seguindo o lema 'Dar de graça o que de graça recebestes'.",
  },
  {
    id: 2,
    question: "Você conhece as principais entidades espirituais que trabalham nos terreiros?",
    questionImage: "/assets/question-entidades-DMFtjsZs.png",
    optionStyle: "solid",
    options: [
      { text: "Sim, todas!" },
      { text: "Conheço algumas." },
      { text: "Ainda estou aprendendo." },
      { text: "Não conheço nenhuma!" },
    ],
    correctAnswer: 0,
    explanation:
      "As principais entidades da Umbanda são os Orixás, Caboclos, Preto Velhos, Erês, Exus e Pombagiras. Cada linha tem sua função específica no auxílio espiritual aos consulentes.",
  },
  {
    id: 3,
    question: "Você gostaria de ter acesso a um APLICATIVO que explica de forma prática e visual todos os fundamentos da Umbanda?",
    options: [
      { text: "Sim, seria incrível!", image: "/assets/result-option-sim-CeTr9lC_.png" },
      { text: "Talvez, dependendo do material.", image: "/assets/option-talvez-DPJvBUqf.png" },
      { text: "Não tenho certeza ainda.", image: "/assets/option-incerteza-BRhgOzPW.png" },
    ],
    correctAnswer: 0,
    explanation:
      "O APP Mapa Mental da Umbanda foi criado exatamente para isso! Um aplicativo que ensina de forma visual e prática todos os fundamentos da religião.",
  },
];

export const getScoreResult = (score: number, total: number) => {
  const percentage = Math.round((score / total) * 100) || 75;
  if (percentage >= 80) {
    return {
      title: "Parabéns! Você é um verdadeiro conhecedor!",
      message:
        "Você demonstrou um excelente conhecimento sobre a Umbanda. Continue estudando e aprofundando sua jornada espiritual!",
      emoji: "🌟",
      label: "Excelente",
      score: 90,
    };
  } else {
    return {
      title: "Muito bem! Você tem grande afinidade espiritual!",
      message:
        "Você demonstrou uma excelente base de conhecimento e interesse genuíno. O Mapa Mental da Umbanda foi feito sob medida para organizar o que você precisa aprender!",
      emoji: "✨",
      label: "Apto para o App",
      score: 85,
    };
  }
};
