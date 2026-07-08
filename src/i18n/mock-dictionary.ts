import "server-only";
import type { Locale } from "./config";

// Localized content for the demo/fallback AI output (src/server/ai/mock.ts).
// Kept separate from the UI Dictionary since it's server-only content.

export type MockStrings = {
  notice: string;
  demoFor: string;
  by: string;
  introExtra: string;
  sec1Head: string;
  sec1Body: string;
  sec1p1: string;
  sec1p2: string;
  sec1p3: string;
  sec2Head: string;
  sec2Body: string;
  sec2p1: string;
  sec2p2: string;
  sec2p3: string;
  sec3Head: string;
  sec3Body: string;
  sec3p1: string;
  sec3p2: string;
  conclusion: string;
  kp1: string;
  kp2: string;
  kp3: string;
  kp4: string;
  mcQuestion: string; // uses {title}
  mcWrong1: string;
  mcWrong2: string;
  mcWrong3: string;
  mcRef: string;
  tfQuestion: string;
  tfRef: string;
  saQuestion: string;
  saAnswer: string;
  saRef: string;
  explLead: string; // "The correct answer is"
  explTail: string;
  explRef: string;
};

export const mockDictionaries: Record<Locale, MockStrings> = {
  ro: {
    notice:
      "(Conținut demonstrativ — serviciul AI nu e configurat. Adaugă o cheie GRATUITĂ Gemini (GEMINI_API_KEY) de la aistudio.google.com pentru rezumate reale, generate de AI.)",
    demoFor: "Rezumat demonstrativ pentru",
    by: "de",
    introExtra:
      "Structura reflectă ceea ce ar produce AI-ul: secțiuni clare, cu puncte-cheie.",
    sec1Head: "Ideile principale",
    sec1Body:
      "Cartea explorează temele centrale și argumentele autorului, oferind o hartă a conceptelor esențiale.",
    sec1p1: "Tema centrală și de ce contează",
    sec1p2: "Argumentul principal al autorului",
    sec1p3: "Contextul în care apar ideile",
    sec2Head: "Concepte importante",
    sec2Body:
      "Sunt introduse concepte-cheie care structurează întreaga lucrare și pe care se sprijină concluziile.",
    sec2p1: "Concept 1 și definiția sa",
    sec2p2: "Concept 2 și relația cu tema",
    sec2p3: "Cum se leagă conceptele între ele",
    sec3Head: "Aplicații și exemple",
    sec3Body:
      "Autorul ilustrează ideile cu exemple concrete, ușor de reținut și de aplicat.",
    sec3p1: "Exemplu ilustrativ",
    sec3p2: "Lecția practică desprinsă",
    conclusion:
      "În concluzie, cartea oferă un cadru clar pentru înțelegerea temei, cu idei aplicabile imediat.",
    kp1: "Tema centrală este firul roșu al cărții",
    kp2: "Conceptele-cheie se susțin reciproc",
    kp3: "Exemplele fac ideile ușor de aplicat",
    kp4: "Concluziile oferă direcții practice",
    mcQuestion: "Care este una dintre ideile principale din „{title}”?",
    mcWrong1: "O idee complet nelegată",
    mcWrong2: "Un detaliu minor irelevant",
    mcWrong3: "Nimic din ce apare în carte",
    mcRef: "Secțiunea „Ideile principale”",
    tfQuestion: "Conceptele-cheie din carte se susțin reciproc.",
    tfRef: "Secțiunea „Concepte importante”",
    saQuestion:
      "Numește pe scurt un exemplu prin care autorul ilustrează ideile.",
    saAnswer: "Un exemplu ilustrativ din carte",
    saRef: "Secțiunea „Aplicații și exemple”",
    explLead: "Răspunsul corect este",
    explTail:
      "Cu serviciul AI activ, AI-ul oferă o explicație detaliată legată de conținutul cărții.",
    explRef: "Revezi secțiunea relevantă din rezumat.",
  },
  en: {
    notice:
      "(Demo content — the AI service is not configured. Add a FREE Gemini key (GEMINI_API_KEY) from aistudio.google.com for real, AI-generated summaries.)",
    demoFor: "Demo summary for",
    by: "by",
    introExtra:
      "The structure reflects what the AI would produce: clear sections with key points.",
    sec1Head: "The main ideas",
    sec1Body:
      "The book explores the central themes and the author's arguments, offering a map of the essential concepts.",
    sec1p1: "The central theme and why it matters",
    sec1p2: "The author's main argument",
    sec1p3: "The context in which the ideas appear",
    sec2Head: "Important concepts",
    sec2Body:
      "Key concepts are introduced that structure the whole work and support the conclusions.",
    sec2p1: "Concept 1 and its definition",
    sec2p2: "Concept 2 and its relation to the theme",
    sec2p3: "How the concepts connect to each other",
    sec3Head: "Applications and examples",
    sec3Body:
      "The author illustrates the ideas with concrete examples that are easy to remember and apply.",
    sec3p1: "An illustrative example",
    sec3p2: "The practical lesson drawn",
    conclusion:
      "In conclusion, the book offers a clear framework for understanding the theme, with immediately applicable ideas.",
    kp1: "The central theme is the book's common thread",
    kp2: "The key concepts support each other",
    kp3: "The examples make the ideas easy to apply",
    kp4: "The conclusions offer practical directions",
    mcQuestion: "Which is one of the main ideas in “{title}”?",
    mcWrong1: "A completely unrelated idea",
    mcWrong2: "An irrelevant minor detail",
    mcWrong3: "Nothing that appears in the book",
    mcRef: "The “Main ideas” section",
    tfQuestion: "The book's key concepts support each other.",
    tfRef: "The “Important concepts” section",
    saQuestion: "Briefly name an example the author uses to illustrate the ideas.",
    saAnswer: "An illustrative example from the book",
    saRef: "The “Applications and examples” section",
    explLead: "The correct answer is",
    explTail:
      "With the AI service active, the AI provides a detailed explanation tied to the book's content.",
    explRef: "Review the relevant section of the summary.",
  },
  es: {
    notice:
      "(Contenido de demostración — el servicio de IA no está configurado. Añade una clave GRATUITA de Gemini (GEMINI_API_KEY) desde aistudio.google.com para obtener resúmenes reales generados por IA.)",
    demoFor: "Resumen de demostración para",
    by: "de",
    introExtra:
      "La estructura refleja lo que produciría la IA: secciones claras con puntos clave.",
    sec1Head: "Las ideas principales",
    sec1Body:
      "El libro explora los temas centrales y los argumentos del autor, ofreciendo un mapa de los conceptos esenciales.",
    sec1p1: "El tema central y por qué importa",
    sec1p2: "El argumento principal del autor",
    sec1p3: "El contexto en el que aparecen las ideas",
    sec2Head: "Conceptos importantes",
    sec2Body:
      "Se introducen conceptos clave que estructuran toda la obra y en los que se apoyan las conclusiones.",
    sec2p1: "Concepto 1 y su definición",
    sec2p2: "Concepto 2 y su relación con el tema",
    sec2p3: "Cómo se conectan los conceptos entre sí",
    sec3Head: "Aplicaciones y ejemplos",
    sec3Body:
      "El autor ilustra las ideas con ejemplos concretos, fáciles de recordar y aplicar.",
    sec3p1: "Un ejemplo ilustrativo",
    sec3p2: "La lección práctica obtenida",
    conclusion:
      "En conclusión, el libro ofrece un marco claro para entender el tema, con ideas aplicables de inmediato.",
    kp1: "El tema central es el hilo conductor del libro",
    kp2: "Los conceptos clave se apoyan mutuamente",
    kp3: "Los ejemplos hacen que las ideas sean fáciles de aplicar",
    kp4: "Las conclusiones ofrecen direcciones prácticas",
    mcQuestion: "¿Cuál es una de las ideas principales de «{title}»?",
    mcWrong1: "Una idea totalmente ajena",
    mcWrong2: "Un detalle menor irrelevante",
    mcWrong3: "Nada de lo que aparece en el libro",
    mcRef: "La sección «Las ideas principales»",
    tfQuestion: "Los conceptos clave del libro se apoyan mutuamente.",
    tfRef: "La sección «Conceptos importantes»",
    saQuestion: "Nombra brevemente un ejemplo con el que el autor ilustra las ideas.",
    saAnswer: "Un ejemplo ilustrativo del libro",
    saRef: "La sección «Aplicaciones y ejemplos»",
    explLead: "La respuesta correcta es",
    explTail:
      "Con el servicio de IA activo, la IA ofrece una explicación detallada ligada al contenido del libro.",
    explRef: "Revisa la sección relevante del resumen.",
  },
  fr: {
    notice:
      "(Contenu de démonstration — le service IA n'est pas configuré. Ajoutez une clé GRATUITE Gemini (GEMINI_API_KEY) depuis aistudio.google.com pour de vrais résumés générés par l'IA.)",
    demoFor: "Résumé de démonstration pour",
    by: "de",
    introExtra:
      "La structure reflète ce que l'IA produirait : des sections claires avec des points clés.",
    sec1Head: "Les idées principales",
    sec1Body:
      "Le livre explore les thèmes centraux et les arguments de l'auteur, offrant une carte des concepts essentiels.",
    sec1p1: "Le thème central et pourquoi il compte",
    sec1p2: "L'argument principal de l'auteur",
    sec1p3: "Le contexte dans lequel apparaissent les idées",
    sec2Head: "Concepts importants",
    sec2Body:
      "Des concepts clés sont introduits, qui structurent toute l'œuvre et sur lesquels reposent les conclusions.",
    sec2p1: "Concept 1 et sa définition",
    sec2p2: "Concept 2 et son lien avec le thème",
    sec2p3: "Comment les concepts se relient entre eux",
    sec3Head: "Applications et exemples",
    sec3Body:
      "L'auteur illustre les idées par des exemples concrets, faciles à retenir et à appliquer.",
    sec3p1: "Un exemple illustratif",
    sec3p2: "La leçon pratique tirée",
    conclusion:
      "En conclusion, le livre offre un cadre clair pour comprendre le thème, avec des idées immédiatement applicables.",
    kp1: "Le thème central est le fil rouge du livre",
    kp2: "Les concepts clés se soutiennent mutuellement",
    kp3: "Les exemples rendent les idées faciles à appliquer",
    kp4: "Les conclusions offrent des orientations pratiques",
    mcQuestion: "Quelle est l'une des idées principales de « {title} » ?",
    mcWrong1: "Une idée totalement sans rapport",
    mcWrong2: "Un détail mineur sans importance",
    mcWrong3: "Rien de ce qui figure dans le livre",
    mcRef: "La section « Les idées principales »",
    tfQuestion: "Les concepts clés du livre se soutiennent mutuellement.",
    tfRef: "La section « Concepts importants »",
    saQuestion: "Nommez brièvement un exemple par lequel l'auteur illustre les idées.",
    saAnswer: "Un exemple illustratif du livre",
    saRef: "La section « Applications et exemples »",
    explLead: "La bonne réponse est",
    explTail:
      "Avec le service IA actif, l'IA fournit une explication détaillée liée au contenu du livre.",
    explRef: "Revoyez la section concernée du résumé.",
  },
  de: {
    notice:
      "(Demo-Inhalt — der KI-Dienst ist nicht konfiguriert. Füge einen KOSTENLOSEN Gemini-Schlüssel (GEMINI_API_KEY) von aistudio.google.com hinzu, um echte, KI-generierte Zusammenfassungen zu erhalten.)",
    demoFor: "Demo-Zusammenfassung für",
    by: "von",
    introExtra:
      "Die Struktur spiegelt wider, was die KI erzeugen würde: klare Abschnitte mit Kernpunkten.",
    sec1Head: "Die Kernideen",
    sec1Body:
      "Das Buch untersucht die zentralen Themen und die Argumente des Autors und bietet eine Karte der wesentlichen Konzepte.",
    sec1p1: "Das zentrale Thema und warum es wichtig ist",
    sec1p2: "Das Hauptargument des Autors",
    sec1p3: "Der Kontext, in dem die Ideen erscheinen",
    sec2Head: "Wichtige Konzepte",
    sec2Body:
      "Es werden Kernkonzepte eingeführt, die das gesamte Werk strukturieren und auf denen die Schlussfolgerungen beruhen.",
    sec2p1: "Konzept 1 und seine Definition",
    sec2p2: "Konzept 2 und sein Bezug zum Thema",
    sec2p3: "Wie die Konzepte miteinander zusammenhängen",
    sec3Head: "Anwendungen und Beispiele",
    sec3Body:
      "Der Autor veranschaulicht die Ideen mit konkreten Beispielen, die leicht zu merken und anzuwenden sind.",
    sec3p1: "Ein anschauliches Beispiel",
    sec3p2: "Die daraus gezogene praktische Lehre",
    conclusion:
      "Zusammenfassend bietet das Buch einen klaren Rahmen zum Verständnis des Themas, mit sofort anwendbaren Ideen.",
    kp1: "Das zentrale Thema ist der rote Faden des Buches",
    kp2: "Die Kernkonzepte stützen sich gegenseitig",
    kp3: "Die Beispiele machen die Ideen leicht anwendbar",
    kp4: "Die Schlussfolgerungen geben praktische Richtungen vor",
    mcQuestion: "Was ist eine der Kernideen in „{title}“?",
    mcWrong1: "Eine völlig unzusammenhängende Idee",
    mcWrong2: "Ein irrelevantes Nebendetail",
    mcWrong3: "Nichts, was im Buch vorkommt",
    mcRef: "Der Abschnitt „Die Kernideen“",
    tfQuestion: "Die Kernkonzepte des Buches stützen sich gegenseitig.",
    tfRef: "Der Abschnitt „Wichtige Konzepte“",
    saQuestion: "Nenne kurz ein Beispiel, mit dem der Autor die Ideen veranschaulicht.",
    saAnswer: "Ein anschauliches Beispiel aus dem Buch",
    saRef: "Der Abschnitt „Anwendungen und Beispiele“",
    explLead: "Die richtige Antwort ist",
    explTail:
      "Bei aktivem KI-Dienst liefert die KI eine ausführliche, auf den Buchinhalt bezogene Erklärung.",
    explRef: "Sieh dir den betreffenden Abschnitt der Zusammenfassung an.",
  },
  it: {
    notice:
      "(Contenuto dimostrativo — il servizio IA non è configurato. Aggiungi una chiave GRATUITA Gemini (GEMINI_API_KEY) da aistudio.google.com per riassunti reali generati dall'IA.)",
    demoFor: "Riassunto dimostrativo per",
    by: "di",
    introExtra:
      "La struttura riflette ciò che produrrebbe l'IA: sezioni chiare con punti chiave.",
    sec1Head: "Le idee principali",
    sec1Body:
      "Il libro esplora i temi centrali e gli argomenti dell'autore, offrendo una mappa dei concetti essenziali.",
    sec1p1: "Il tema centrale e perché conta",
    sec1p2: "L'argomento principale dell'autore",
    sec1p3: "Il contesto in cui appaiono le idee",
    sec2Head: "Concetti importanti",
    sec2Body:
      "Vengono introdotti concetti chiave che strutturano l'intera opera e su cui si basano le conclusioni.",
    sec2p1: "Concetto 1 e la sua definizione",
    sec2p2: "Concetto 2 e la sua relazione con il tema",
    sec2p3: "Come i concetti si collegano tra loro",
    sec3Head: "Applicazioni ed esempi",
    sec3Body:
      "L'autore illustra le idee con esempi concreti, facili da ricordare e da applicare.",
    sec3p1: "Un esempio illustrativo",
    sec3p2: "La lezione pratica tratta",
    conclusion:
      "In conclusione, il libro offre un quadro chiaro per comprendere il tema, con idee immediatamente applicabili.",
    kp1: "Il tema centrale è il filo conduttore del libro",
    kp2: "I concetti chiave si sostengono a vicenda",
    kp3: "Gli esempi rendono le idee facili da applicare",
    kp4: "Le conclusioni offrono indicazioni pratiche",
    mcQuestion: "Qual è una delle idee principali di «{title}»?",
    mcWrong1: "Un'idea del tutto estranea",
    mcWrong2: "Un dettaglio minore irrilevante",
    mcWrong3: "Niente di ciò che appare nel libro",
    mcRef: "La sezione «Le idee principali»",
    tfQuestion: "I concetti chiave del libro si sostengono a vicenda.",
    tfRef: "La sezione «Concetti importanti»",
    saQuestion:
      "Nomina brevemente un esempio con cui l'autore illustra le idee.",
    saAnswer: "Un esempio illustrativo dal libro",
    saRef: "La sezione «Applicazioni ed esempi»",
    explLead: "La risposta corretta è",
    explTail:
      "Con il servizio IA attivo, l'IA fornisce una spiegazione dettagliata legata al contenuto del libro.",
    explRef: "Rivedi la sezione pertinente del riassunto.",
  },
  zh: {
    notice:
      "（演示内容——AI 服务尚未配置。请从 aistudio.google.com 添加一个免费的 Gemini 密钥（GEMINI_API_KEY），以获得由 AI 生成的真实摘要。）",
    demoFor: "演示摘要：",
    by: "作者",
    introExtra: "此结构反映了 AI 会生成的内容：清晰的分节和要点。",
    sec1Head: "核心思想",
    sec1Body: "本书探讨了核心主题和作者的论点，勾勒出关键概念的脉络。",
    sec1p1: "核心主题及其重要性",
    sec1p2: "作者的主要论点",
    sec1p3: "这些思想出现的背景",
    sec2Head: "重要概念",
    sec2Body: "书中引入了贯穿全书的关键概念，结论正是建立在这些概念之上。",
    sec2p1: "概念一及其定义",
    sec2p2: "概念二及其与主题的关系",
    sec2p3: "各概念之间如何相互关联",
    sec3Head: "应用与实例",
    sec3Body: "作者用具体的例子来阐明这些思想，易于记忆和应用。",
    sec3p1: "一个说明性的例子",
    sec3p2: "从中得出的实践启示",
    conclusion:
      "总之，本书为理解该主题提供了清晰的框架，并给出可立即应用的思想。",
    kp1: "核心主题是全书的主线",
    kp2: "关键概念相互支撑",
    kp3: "实例让思想易于应用",
    kp4: "结论给出实践方向",
    mcQuestion: "以下哪一项是《{title}》的核心思想之一？",
    mcWrong1: "一个完全无关的想法",
    mcWrong2: "一个无关紧要的细节",
    mcWrong3: "书中根本没有出现的内容",
    mcRef: "「核心思想」一节",
    tfQuestion: "本书的关键概念相互支撑。",
    tfRef: "「重要概念」一节",
    saQuestion: "简要说出作者用来阐明思想的一个例子。",
    saAnswer: "书中一个说明性的例子",
    saRef: "「应用与实例」一节",
    explLead: "正确答案是",
    explTail: "当 AI 服务启用时，AI 会提供与本书内容相关的详细解析。",
    explRef: "请重温摘要中的相关部分。",
  },
  ja: {
    notice:
      "（デモ内容——AI サービスが設定されていません。aistudio.google.com から無料の Gemini キー（GEMINI_API_KEY）を追加すると、AI が生成する本物の要約が得られます。）",
    demoFor: "デモ要約：",
    by: "著者",
    introExtra:
      "この構成は AI が生成する内容を反映しています：要点を備えた明快なセクション。",
    sec1Head: "主要な考え",
    sec1Body:
      "本書は中心的なテーマと著者の主張を探り、重要な概念の地図を示します。",
    sec1p1: "中心テーマとその重要性",
    sec1p2: "著者の主要な主張",
    sec1p3: "その考えが現れる文脈",
    sec2Head: "重要な概念",
    sec2Body:
      "作品全体を構成し、結論の土台となる重要な概念が導入されます。",
    sec2p1: "概念 1 とその定義",
    sec2p2: "概念 2 とテーマとの関係",
    sec2p3: "概念どうしがどのように結びつくか",
    sec3Head: "応用と例",
    sec3Body:
      "著者は具体的な例で考えを示し、覚えやすく応用しやすくしています。",
    sec3p1: "分かりやすい例",
    sec3p2: "そこから得られる実践的な教訓",
    conclusion:
      "結論として、本書はテーマを理解するための明快な枠組みと、すぐに応用できる考えを提供します。",
    kp1: "中心テーマは本書の主軸である",
    kp2: "重要な概念は互いに支え合う",
    kp3: "例が考えを応用しやすくする",
    kp4: "結論は実践的な方向性を示す",
    mcQuestion: "『{title}』の主要な考えの一つはどれですか？",
    mcWrong1: "まったく無関係な考え",
    mcWrong2: "重要でない些細な点",
    mcWrong3: "本書に出てこない内容",
    mcRef: "「主要な考え」のセクション",
    tfQuestion: "本書の重要な概念は互いに支え合っている。",
    tfRef: "「重要な概念」のセクション",
    saQuestion:
      "著者が考えを示すために用いた例を一つ簡潔に挙げてください。",
    saAnswer: "本書の分かりやすい例",
    saRef: "「応用と例」のセクション",
    explLead: "正解は",
    explTail:
      "AI サービスが有効な場合、AI は本書の内容に関連した詳しい解説を提供します。",
    explRef: "要約の該当セクションを見直してください。",
  },
};

export function getMockStrings(locale: Locale): MockStrings {
  return mockDictionaries[locale];
}
