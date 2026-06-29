/**
 * Post-story comprehension quizzes for "A Day in Harare".
 *
 * Every lesson (keyed by `order`) gets five questions, one of each type:
 *   1. multiple-choice  — pick the right answer
 *   2. true-false       — judge a statement about the story
 *   3. sequence         — tap the events into the order they happened
 *   4. who-said-it      — match a quote (or photo) to the person
 *   5. fill-blank       — choose the word that completes a line
 *
 * Every piece of learner-facing text is trilingual ({ en, fr, zh }) so the
 * quiz reads in French and Chinese with English underneath, exactly like the
 * reader. UI chrome (buttons, "Correct!") stays in English in the component.
 */

export type LocalizedText = { en: string; fr: string; zh: string };

/** Shorthand so the data below stays readable: t(english, french, chinese). */
const t = (en: string, fr: string, zh: string): LocalizedText => ({
  en,
  fr,
  zh,
});

export type MultipleChoiceQuestion = {
  type: "multiple-choice";
  prompt: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
};

export type TrueFalseQuestion = {
  type: "true-false";
  statement: LocalizedText;
  answer: boolean;
};

export type SequenceQuestion = {
  type: "sequence";
  prompt: LocalizedText;
  /** Items in the CORRECT order; the component shuffles them for display. */
  items: LocalizedText[];
};

export type WhoSaidItQuestion = {
  type: "who-said-it";
  prompt: LocalizedText;
  quote: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
};

export type FillBlankQuestion = {
  type: "fill-blank";
  /** Sentence containing a visible blank ("___") in each language. */
  sentence: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | SequenceQuestion
  | WhoSaidItQuestion
  | FillBlankQuestion;

/** Quiz questions keyed by lesson `order` (1–10). */
export const QUIZZES: Record<number, QuizQuestion[]> = {
  // 1 — Morning in Harare
  1: [
    {
      type: "multiple-choice",
      prompt: t(
        "What time of day is it in the story?",
        "À quel moment de la journée se passe l'histoire ?",
        "故事发生在一天中的什么时候？",
      ),
      options: [
        t("Early morning", "Tôt le matin", "清晨"),
        t("Night", "La nuit", "夜晚"),
        t("Afternoon", "L'après-midi", "下午"),
        t("Evening", "Le soir", "傍晚"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Tendai is happy. He likes mornings in Harare.",
        "Tendai est heureux. Il aime les matins à Harare.",
        "滕代很高兴。他喜欢哈拉雷的早晨。",
      ),
      answer: true,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the morning in order.",
        "Remets la matinée dans l'ordre.",
        "把这个早晨按顺序排列。",
      ),
      items: [
        t("He washes his face.", "Il se lave le visage.", "他洗脸。"),
        t("He puts on his shirt.", "Il met sa chemise.", "他穿上衬衫。"),
        t("He goes outside.", "Il sort dehors.", "他走到外面。"),
        t(
          "Tendai walks, happy.",
          "Tendai marche, heureux.",
          "滕代高兴地走着。",
        ),
      ],
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who is the story about?",
        "De qui parle l'histoire ?",
        "这个故事是关于谁的？",
      ),
      quote: t(
        "He is happy. He likes mornings in Harare.",
        "Il est heureux. Il aime les matins à Harare.",
        "他很高兴。他喜欢哈拉雷的早晨。",
      ),
      options: [
        t("Tendai", "Tendai", "滕代"),
        t("His mother", "Sa mère", "他的妈妈"),
        t("A bus driver", "Un chauffeur de bus", "公交司机"),
        t("A neighbour", "Un voisin", "邻居"),
      ],
      correctIndex: 0,
    },
    {
      type: "fill-blank",
      sentence: t("The sky is ___.", "Le ciel est ___.", "天空是___色的。"),
      options: [
        t("orange", "orange", "橙"),
        t("blue", "bleu", "蓝"),
        t("grey", "gris", "灰"),
        t("green", "vert", "绿"),
      ],
      correctIndex: 0,
    },
  ],

  // 2 — The Newspaper Man
  2: [
    {
      type: "multiple-choice",
      prompt: t(
        "How much does the newspaper cost?",
        "Combien coûte le journal ?",
        "报纸多少钱？",
      ),
      options: [
        t("One dollar", "Un dollar", "一美元"),
        t("Two dollars", "Deux dollars", "两美元"),
        t("Five dollars", "Cinq dollars", "五美元"),
        t("It is free", "Il est gratuit", "免费"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Tendai buys a newspaper.",
        "Tendai achète un journal.",
        "滕代买了一份报纸。",
      ),
      answer: true,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Same as yesterday. Someone is stealing. Someone is crying. And we are all going to work.",
        "Pareil qu'hier. Quelqu'un vole. Quelqu'un pleure. Et nous allons tous travailler.",
        "和昨天一样。有人在偷，有人在哭，我们都去上班。",
      ),
      options: [
        t("The newspaper man", "Le vendeur de journaux", "报贩"),
        t("Tendai", "Tendai", "滕代"),
        t("His mother", "Sa mère", "他的妈妈"),
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the scene in order.",
        "Remets la scène dans l'ordre.",
        "把这个场景按顺序排列。",
      ),
      items: [
        t(
          "Tendai sees the newspaper man.",
          "Tendai voit le vendeur de journaux.",
          "滕代看到报贩。",
        ),
        t(
          "He asks for a newspaper.",
          "Il demande un journal.",
          "他要一份报纸。",
        ),
        t("He pays one dollar.", "Il paie un dollar.", "他付了一美元。"),
        t(
          "He laughs and walks on.",
          "Il rit et continue à marcher.",
          "他笑着继续往前走。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "Tendai takes one ___ from his pocket.",
        "Tendai prend un ___ dans sa poche.",
        "滕代从口袋里拿出一___。",
      ),
      options: [
        t("dollar", "dollar", "美元"),
        t("newspaper", "journal", "报纸"),
        t("phone", "téléphone", "手机"),
        t("apple", "pomme", "苹果"),
      ],
      correctIndex: 0,
    },
  ],

  // 3 — Mbare Market Arrives
  3: [
    {
      type: "multiple-choice",
      prompt: t(
        "How did Tendai travel to Mbare?",
        "Comment Tendai est-il allé à Mbare ?",
        "滕代怎么去姆巴雷的？",
      ),
      options: [
        t("By bus", "En bus", "坐公共汽车"),
        t("On foot", "À pied", "步行"),
        t("By bicycle", "À vélo", "骑自行车"),
        t("By train", "En train", "坐火车"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "The market was quiet and empty.",
        "Le marché était calme et vide.",
        "市场又安静又空荡。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t("Who is thinking this?", "Qui pense cela ?", "这是谁在想？"),
      quote: t(
        "Forty dollars. Three things. I must be careful.",
        "Quarante dollars. Trois choses. Je dois faire attention.",
        "四十美元。三样东西。我必须小心。",
      ),
      options: [
        t("Tendai", "Tendai", "滕代"),
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
        t("The bus driver", "Le chauffeur de bus", "公交司机"),
        t("A vendor", "Un vendeur", "一个小贩"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the market trip in order.",
        "Remets la sortie au marché dans l'ordre.",
        "把逛市场的过程按顺序排列。",
      ),
      items: [
        t(
          "He took a bus to Mbare.",
          "Il a pris un bus pour Mbare.",
          "他坐公共汽车去姆巴雷。",
        ),
        t(
          "He arrived at the busy market.",
          "Il est arrivé au marché animé.",
          "他到了热闹的市场。",
        ),
        t(
          "He saw many colours.",
          "Il a vu beaucoup de couleurs.",
          "他看到很多颜色。",
        ),
        t(
          "He walked slowly with forty dollars.",
          "Il a marché lentement avec quarante dollars.",
          "他带着四十美元慢慢地走。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "He had ___ dollars in his pocket.",
        "Il avait ___ dollars dans sa poche.",
        "他口袋里有___美元。",
      ),
      options: [
        t("forty", "quarante", "四十"),
        t("four", "quatre", "四"),
        t("fourteen", "quatorze", "十四"),
        t("fifty", "cinquante", "五十"),
      ],
      correctIndex: 0,
    },
  ],

  // 4 — Ambuya Chipo's Tomatoes
  4: [
    {
      type: "multiple-choice",
      prompt: t(
        "How old was Ambuya Chipo?",
        "Quel âge avait Ambuya Chipo ?",
        "奇波奶奶多大年纪？",
      ),
      options: [
        t("Seventy", "Soixante-dix", "七十岁"),
        t("Seventeen", "Dix-sept", "十七岁"),
        t("Sixty", "Soixante", "六十岁"),
        t("Eighty", "Quatre-vingts", "八十岁"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Ambuya Chipo did not recognise Tendai.",
        "Ambuya Chipo n'a pas reconnu Tendai.",
        "奇波奶奶没有认出滕代。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Smart boy. Your mother raised you well. Take these tomatoes. Five dollars.",
        "Garçon intelligent. Ta mère t'a bien élevé. Prends ces tomates. Cinq dollars.",
        "聪明的孩子。你妈妈把你教得很好。拿这些西红柿。五美元。",
      ),
      options: [
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
        t("Tendai", "Tendai", "滕代"),
        t("His mother", "Sa mère", "他的妈妈"),
        t("The newspaper man", "Le vendeur de journaux", "报贩"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the visit in order.",
        "Remets la visite dans l'ordre.",
        "把这次拜访按顺序排列。",
      ),
      items: [
        t(
          "Tendai comes to the stall.",
          "Tendai vient à l'étal.",
          "滕代来到摊位。",
        ),
        t(
          "Ambuya Chipo recognises him.",
          "Ambuya Chipo le reconnaît.",
          "奇波奶奶认出了他。",
        ),
        t(
          "She sells him tomatoes for five dollars.",
          "Elle lui vend des tomates pour cinq dollars.",
          "她以五美元把西红柿卖给他。",
        ),
        t(
          "Tendai packs the tomatoes carefully.",
          "Tendai range soigneusement les tomates.",
          "滕代小心地把西红柿装好。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "Take these tomatoes. ___ dollars.",
        "Prends ces tomates. ___ dollars.",
        "拿这些西红柿。___美元。",
      ),
      options: [
        t("Five", "Cinq", "五"),
        t("Four", "Quatre", "四"),
        t("Ten", "Dix", "十"),
        t("Two", "Deux", "二"),
      ],
      correctIndex: 0,
    },
  ],

  // 5 — Zhou Wei & the Charger
  5: [
    {
      type: "multiple-choice",
      prompt: t(
        "Where is Zhou Wei from?",
        "D'où vient Zhou Wei ?",
        "周炜来自哪里？",
      ),
      options: [
        t("Guangzhou", "Guangzhou", "广州"),
        t("Harare", "Harare", "哈拉雷"),
        t("Lyon", "Lyon", "里昂"),
        t("Beijing", "Pékin", "北京"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Tendai paid five dollars for the charger.",
        "Tendai a payé cinq dollars pour le chargeur.",
        "滕代花五美元买了充电器。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Hey boss! Charger? Cable? Earphones? Chinese price, American quality!",
        "Hé patron ! Chargeur ? Câble ? Écouteurs ? Prix chinois, qualité américaine !",
        "嘿，老板！充电器？数据线？耳机？中国价格，美国质量！",
      ),
      options: [
        t("Zhou Wei", "Zhou Wei", "周炜"),
        t("Tendai", "Tendai", "滕代"),
        t("Marguerite", "Marguerite", "玛格丽特"),
        t("Professor Ndlovu", "Le professeur Ndlovu", "恩德洛武教授"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the deal in order.",
        "Remets la transaction dans l'ordre.",
        "把这笔交易按顺序排列。",
      ),
      items: [
        t(
          "Tendai finds the electronics street.",
          "Tendai trouve la rue des électroniques.",
          "滕代找到电子产品街。",
        ),
        t(
          "Zhou Wei calls out to him.",
          "Zhou Wei l'interpelle.",
          "周炜向他喊话。",
        ),
        t(
          "They argue about football.",
          "Ils débattent du football.",
          "他们争论足球。",
        ),
        t(
          "Tendai pays three dollars.",
          "Tendai paie trois dollars.",
          "滕代付了三美元。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "Tendai paid ___ dollars for the charger.",
        "Tendai a payé ___ dollars pour le chargeur.",
        "滕代花___美元买了充电器。",
      ),
      options: [
        t("three", "trois", "三"),
        t("five", "cinq", "五"),
        t("two", "deux", "二"),
        t("four", "quatre", "四"),
      ],
      correctIndex: 0,
    },
  ],

  // 6 — Marguerite and the Shoes
  6: [
    {
      type: "multiple-choice",
      prompt: t(
        "What is Marguerite's job?",
        "Quel est le métier de Marguerite ?",
        "玛格丽特的职业是什么？",
      ),
      options: [
        t("Journalist", "Journaliste", "记者"),
        t("Teacher", "Enseignante", "老师"),
        t("Doctor", "Médecin", "医生"),
        t("Shoe seller", "Vendeuse de chaussures", "卖鞋的人"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Marguerite is from Lyon.",
        "Marguerite vient de Lyon.",
        "玛格丽特来自里昂。",
      ),
      answer: true,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Vous parlez français? You speak French?",
        "Vous parlez français ?",
        "你会说法语吗？",
      ),
      options: [
        t("Marguerite", "Marguerite", "玛格丽特"),
        t("Tendai", "Tendai", "滕代"),
        t("The shoe vendor", "Le vendeur de chaussures", "鞋贩"),
        t("Zhou Wei", "Zhou Wei", "周炜"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the meeting in order.",
        "Remets la rencontre dans l'ordre.",
        "把这次相遇按顺序排列。",
      ),
      items: [
        t(
          "Tendai looks at brown shoes.",
          "Tendai regarde des chaussures marron.",
          "滕代在看棕色的鞋子。",
        ),
        t(
          "He hears a woman speaking French.",
          "Il entend une femme parler français.",
          "他听到一个女人说法语。",
        ),
        t(
          "They make a deal together.",
          "Ils concluent un marché.",
          "他们达成了一个交易。",
        ),
        t(
          "He buys the shoes for six dollars.",
          "Il achète les chaussures pour six dollars.",
          "他用六美元买下了鞋子。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "The shoes cost ___ dollars.",
        "Les chaussures coûtent ___ dollars.",
        "鞋子花了___美元。",
      ),
      options: [
        t("six", "six", "六"),
        t("ten", "dix", "十"),
        t("four", "quatre", "四"),
        t("eight", "huit", "八"),
      ],
      correctIndex: 0,
    },
  ],

  // 7 — Mama Rudo's Restaurant
  7: [
    {
      type: "multiple-choice",
      prompt: t(
        "What did the chalkboard outside say?",
        "Que disait le tableau devant le restaurant ?",
        "餐厅外的黑板上写着什么？",
      ),
      options: [
        t(
          "Eat well. Pay what you can.",
          "Mangez bien. Payez ce que vous pouvez.",
          "吃好，量力而付。",
        ),
        t("Closed today.", "Fermé aujourd'hui.", "今日休息。"),
        t(
          "Best food in Harare.",
          "La meilleure cuisine de Harare.",
          "哈拉雷最好的菜。",
        ),
        t(
          "No money, no food.",
          "Pas d'argent, pas de nourriture.",
          "没钱就没饭。",
        ),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "The restaurant had a big sign outside.",
        "Le restaurant avait une grande enseigne dehors.",
        "餐厅外面有一块大招牌。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "You are carrying many things, young man. But which of those things is actually carrying you?",
        "Vous portez beaucoup de choses, jeune homme. Mais laquelle de ces choses vous porte vraiment ?",
        "年轻人，你携带着很多东西。但其中哪样东西在承载着你呢？",
      ),
      options: [
        t("Professor Ndlovu", "Le professeur Ndlovu", "恩德洛武教授"),
        t("Mama Rudo", "Mama Rudo", "鲁多妈妈"),
        t("Tendai", "Tendai", "滕代"),
        t("Marguerite", "Marguerite", "玛格丽特"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the visit in order.",
        "Remets la visite dans l'ordre.",
        "把这次用餐按顺序排列。",
      ),
      items: [
        t("Tendai is hungry.", "Tendai a faim.", "滕代饿了。"),
        t(
          "He walks to Mama Rudo's restaurant.",
          "Il marche jusqu'au restaurant de Mama Rudo.",
          "他走到鲁多妈妈的餐厅。",
        ),
        t(
          "He meets Professor Ndlovu.",
          "Il rencontre le professeur Ndlovu.",
          "他遇到了恩德洛武教授。",
        ),
        t(
          "They eat together in silence.",
          "Ils mangent ensemble en silence.",
          "他们在沉默中一起吃饭。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "Mama Rudo used ___ in the sadza.",
        "Mama Rudo a mis du ___ dans la sadza.",
        "鲁多妈妈在玉米糊里加了___。",
      ),
      options: [
        t("peanut butter", "beurre de cacahuètes", "花生酱"),
        t("sugar", "sucre", "糖"),
        t("salt", "sel", "盐"),
        t("milk", "lait", "牛奶"),
      ],
      correctIndex: 0,
    },
  ],

  // 8 — The Professor's Question
  8: [
    {
      type: "multiple-choice",
      prompt: t(
        "How many real conversations did Tendai have that morning?",
        "Combien de vraies conversations Tendai a-t-il eues ce matin-là ?",
        "那天上午，滕代进行了几次真正的对话？",
      ),
      options: [
        t("Five", "Cinq", "五次"),
        t("Three", "Trois", "三次"),
        t("Two", "Deux", "两次"),
        t("Ten", "Dix", "十次"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "The professor says people in big cities talk to strangers more.",
        "Le professeur dit que les gens des grandes villes parlent plus aux étrangers.",
        "教授说大城市的人更愿意和陌生人交谈。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Do you know what Harare has that most cities in the world have lost?",
        "Savez-vous ce que Harare possède et que la plupart des villes du monde ont perdu ?",
        "你知道哈拉雷有而世界大多数城市已失去的是什么吗？",
      ),
      options: [
        t("Professor Ndlovu", "Le professeur Ndlovu", "恩德洛武教授"),
        t("Tendai", "Tendai", "滕代"),
        t("Mama Rudo", "Mama Rudo", "鲁多妈妈"),
        t("Zhou Wei", "Zhou Wei", "周炜"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the people Tendai met in order.",
        "Remets dans l'ordre les personnes que Tendai a rencontrées.",
        "把滕代遇到的人按顺序排列。",
      ),
      items: [
        t("The newspaper man", "Le vendeur de journaux", "报贩"),
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
        t("Zhou Wei", "Zhou Wei", "周炜"),
        t("Marguerite", "Marguerite", "玛格丽特"),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "When we stop talking to strangers, we stop ___.",
        "Quand nous cessons de parler aux étrangers, nous cessons de ___.",
        "当我们停止和陌生人交谈，我们就停止了___。",
      ),
      options: [
        t("thinking", "penser", "思考"),
        t("walking", "marcher", "走路"),
        t("eating", "manger", "吃饭"),
        t("working", "travailler", "工作"),
      ],
      correctIndex: 0,
    },
  ],

  // 9 — The Ride Home
  9: [
    {
      type: "multiple-choice",
      prompt: t(
        "What did the kombi hit on Harare Drive?",
        "Qu'est-ce que le kombi a heurté sur Harare Drive ?",
        "小巴在哈拉雷大道上撞到了什么？",
      ),
      options: [
        t("A pothole", "Un nid-de-poule", "一个坑洼"),
        t("A dog", "Un chien", "一只狗"),
        t("Another car", "Une autre voiture", "另一辆车"),
        t("A wall", "Un mur", "一堵墙"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Marguerite sent Tendai photographs.",
        "Marguerite a envoyé des photos à Tendai.",
        "玛格丽特给滕代发了照片。",
      ),
      answer: true,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who is in this photograph?",
        "Qui est sur cette photo ?",
        "这张照片里是谁？",
      ),
      quote: t(
        "His arms were full of cables, caught mid-sentence.",
        "Les bras pleins de câbles, saisi en pleine phrase.",
        "手臂抱满数据线，说话说到一半被拍下。",
      ),
      options: [
        t("Zhou Wei", "Zhou Wei", "周炜"),
        t("Professor Ndlovu", "Le professeur Ndlovu", "恩德洛武教授"),
        t("The newspaper man", "Le vendeur de journaux", "报贩"),
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the ride home in order.",
        "Remets le trajet du retour dans l'ordre.",
        "把回家的路途按顺序排列。",
      ),
      items: [
        t(
          "Tendai scrolls through the photos.",
          "Tendai fait défiler les photos.",
          "滕代翻看照片。",
        ),
        t(
          "He thinks about the professor's question.",
          "Il pense à la question du professeur.",
          "他想起教授的问题。",
        ),
        t(
          "The kombi hits a pothole.",
          "Le kombi heurte un nid-de-poule.",
          "小巴撞上一个坑洼。",
        ),
        t(
          "Everyone laughs together.",
          "Tout le monde rit ensemble.",
          "大家一起笑了。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        'Marguerite\'s message said only: "For your ___."',
        "Le message de Marguerite disait seulement : « Pour ta ___. »",
        "玛格丽特的消息只写着：「留作你的___。」",
      ),
      options: [
        t("memory", "mémoire", "记忆"),
        t("money", "argent", "钱"),
        t("work", "travail", "工作"),
        t("family", "famille", "家人"),
      ],
      correctIndex: 0,
    },
  ],

  // 10 — Five Conversations
  10: [
    {
      type: "multiple-choice",
      prompt: t(
        "What colour were the shoes?",
        "De quelle couleur étaient les chaussures ?",
        "鞋子是什么颜色的？",
      ),
      options: [
        t("Brown", "Marron", "棕色"),
        t("Black", "Noir", "黑色"),
        t("White", "Blanc", "白色"),
        t("Red", "Rouge", "红色"),
      ],
      correctIndex: 0,
    },
    {
      type: "true-false",
      statement: t(
        "Tendai found a clear answer to the professor's question.",
        "Tendai a trouvé une réponse claire à la question du professeur.",
        "滕代为教授的问题找到了一个明确的答案。",
      ),
      answer: false,
    },
    {
      type: "who-said-it",
      prompt: t(
        "Who said this line?",
        "Qui a dit cette phrase ?",
        "这句话是谁说的？",
      ),
      quote: t(
        "Did you get the tomatoes?",
        "Tu as pris les tomates ?",
        "你买到西红柿了吗？",
      ),
      options: [
        t("His mother", "Sa mère", "他的妈妈"),
        t("Ambuya Chipo", "Ambuya Chipo", "奇波奶奶"),
        t("Tendai", "Tendai", "滕代"),
        t("Marguerite", "Marguerite", "玛格丽特"),
      ],
      correctIndex: 0,
    },
    {
      type: "sequence",
      prompt: t(
        "Put the ending in order.",
        "Remets la fin dans l'ordre.",
        "把结尾按顺序排列。",
      ),
      items: [
        t(
          "Tendai walks the last block home.",
          "Tendai marche le dernier pâté de maisons jusqu'à chez lui.",
          "滕代走完回家的最后一个街区。",
        ),
        t(
          "He remembers the five people he met.",
          "Il se souvient des cinq personnes rencontrées.",
          "他回想起遇到的五个人。",
        ),
        t(
          "His mother asks about the tomatoes.",
          "Sa mère demande des nouvelles des tomates.",
          "他妈妈问起西红柿。",
        ),
        t(
          "His mother laughs warmly.",
          "Sa mère rit chaleureusement.",
          "他妈妈温暖地笑了。",
        ),
      ],
    },
    {
      type: "fill-blank",
      sentence: t(
        "Outside, the ___ were dark against an orange sky.",
        "Dehors, les ___ se découpaient, sombres, sur un ciel orange.",
        "屋外，___在橙色的天空映衬下显得漆黑。",
      ),
      options: [
        t("jacarandas", "jacarandas", "蓝花楹树"),
        t("houses", "maisons", "房屋"),
        t("cars", "voitures", "汽车"),
        t("birds", "oiseaux", "鸟儿"),
      ],
      correctIndex: 0,
    },
  ],
};
