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
    question: "O que são pontos riscados na Umbanda?",
    questionImage: "/assets/question-pontos-riscados-DSbgj6ry.png",
    optionStyle: "solid",
    options: [
      { text: "Desenhos para identificar entidades" },
      { text: "Um tipo de oferenda" },
      { text: "Não sei, mas estou curioso!" },
    ],
    correctAnswer: 0,
    explanation:
      "Os pontos riscados são desenhos sagrados que representam e identificam as entidades espirituais. Cada símbolo carrega a assinatura energética de um guia ou Orixá.",
  },
  {
    id: 4,
    question: "Você sente que tem dificuldades para entender ou organizar os aprendizados sobre a Umbanda?",
    questionImage: "/assets/question-dificuldades-Dl1jNYxa.gif",
    optionStyle: "solid",
    options: [
      { text: "Sim, sinto falta de um material organizado." },
      { text: "Um pouco, mas consigo aprender." },
      { text: "Não, eu aprendo facilmente." },
    ],
    correctAnswer: 0,
    explanation:
      "Muitos iniciantes sentem dificuldade em organizar os conhecimentos da Umbanda. O APP Mapa Mental da Umbanda foi criado justamente para facilitar essa jornada de aprendizado.",
  },
  {
    id: 5,
    question: "Você gostaria de ter acesso a um APLICATIVO que explica de forma prática e visual todos os fundamentos da Umbanda?",
    questionImage: "/assets/question-aplicativo-DY88zYaI.png",
    options: [
      { text: "Sim, seria incrível!", image: "/assets/result-option-sim-CeTr9lC_.png" },
      { text: "Talvez, dependendo do material.", image: "/assets/option-talvez-DPJvBUqf.png" },
      { text: "Não tenho certeza ainda.", image: "/assets/option-incerteza-BRhgOzPW.png" },
    ],
    correctAnswer: 0,
    explanation:
      "O APP Mapa Mental da Umbanda foi criado exatamente para isso! Um aplicativo que ensina de forma visual e prática todos os fundamentos da religião.",
  },
  {
    id: 6,
    question: "Você conhece os principais arquétipos de cada Orixá?",
    questionImage: "/assets/question-orixas-CFli7e6m.png",
    optionStyle: "solid",
    options: [
      { text: "Sim, conheço e entendo." },
      { text: "Conheço alguns, mas ainda tenho dúvidas." },
      { text: "Não, gostaria de aprender mais." },
    ],
    correctAnswer: 0,
    explanation:
      "Os Orixás são divindades que representam forças da natureza e arquétipos universais. Cada um possui características, cores, elementos e domínios específicos.",
  },
  {
    id: 7,
    question: "Como você se sente em relação aos rituais básicos da Umbanda?",
    questionImage: "/assets/question-rituais-CbJQp2Lx.png",
    optionStyle: "solid",
    options: [
      { text: "Confiante, já sei como realizar." },
      { text: "Um pouco inseguro(a), mas gostaria de aprender." },
      { text: "Perdido(a), preciso de ajuda." },
    ],
    correctAnswer: 0,
    explanation:
      "Os rituais básicos da Umbanda incluem oferendas, firmezas, defumações e trabalhos espirituais. É importante aprender com orientação de pessoas experientes.",
  },
  {
    id: 8,
    question: "Você sabe como montar um altar simples para conectar-se aos Orixás em casa?",
    questionImage: "/assets/question-altar-CvW1ySTd.png",
    optionStyle: "solid",
    options: [
      { text: "Sim, já tenho um altar." },
      { text: "Tenho dúvidas sobre como fazer corretamente." },
      { text: "Não, mas adoraria aprender." },
    ],
    correctAnswer: 0,
    explanation:
      "O altar doméstico é um espaço sagrado para conexão espiritual. Pode incluir imagens de santos, Orixás, velas, flores e elementos que representem sua devoção.",
  },
  {
    id: 9,
    question: "Você entende como os Orixás se relacionam com os elementos da natureza?",
    questionImage: "/assets/question-elementos-DQvYZev0.png",
    optionStyle: "solid",
    options: [
      { text: "Sim, conheço essa relação profundamente." },
      { text: "Conheço um pouco, mas ainda tenho muito a aprender." },
      { text: "Não, mas acho fascinante e quero saber mais." },
    ],
    correctAnswer: 0,
    explanation:
      "Cada Orixá está ligado a elementos da natureza: água (Oxum, Iemanjá), terra (Ossãe, Oxossi), ar (Iansã) e fogo (Xangô). Essa conexão é fundamental na Umbanda.",
  },
];

export const getScoreResult = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage >= 80) {
    return {
      title: "Parabéns! Você é um verdadeiro conhecedor!",
      message:
        "Você demonstrou um excelente conhecimento sobre a Umbanda. Continue estudando e aprofundando sua jornada espiritual!",
      emoji: "🌟",
      label: "Excelente",
    };
  } else if (percentage >= 60) {
    return {
      title: "Muito bem! Você está no caminho certo!",
      message:
        "Você tem uma base de conhecimento sólida. O APP Mapa Mental da Umbanda pode ajudá-lo a aprender ainda mais!",
      emoji: "✨",
      label: "Bom",
    };
  } else if (percentage >= 40) {
    return {
      title: "Você está aprendendo!",
      message:
        "Há muito ainda para descobrir sobre a Umbanda. O APP Mapa Mental da Umbanda é perfeito para você!",
      emoji: "📚",
      label: "Em Desenvolvimento",
    };
  } else {
    return {
      title: "Hora de começar sua jornada!",
      message:
        "A Umbanda é rica em conhecimentos. O APP Mapa Mental da Umbanda vai te guiar nessa descoberta!",
      emoji: "🌱",
      label: "Iniciante",
    };
  }
};
