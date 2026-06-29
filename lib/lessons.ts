import { type ImageSourcePropType } from "react-native";

/**
 * "A Day in Harare" — a trilingual graded reader, 10 lessons.
 *
 * This is the single source of truth for lesson content. Each lesson is split
 * into ordered `sections` (one paragraph or dialogue line each). Every section
 * carries all three languages plus a `context` label that is either a speaker
 * name (dialogue) or a section tag like "Narration" / "Thinking".
 *
 * The DB seed in `lib/db.ts` reads from here; the story screen reads cards,
 * the reader header, and the vocabulary recap from here too.
 */

export type Section = {
  /** Speaker name for dialogue, or a tag such as "Narration" / "Thinking". */
  context: string;
  english: string;
  french: string;
  chinese: string;
};

export type Vocab = {
  english: string;
  french: string;
  chinese: string;
  note: string;
};

export type LessonContent = {
  order: number;
  level: string;
  /** Grammar / theme focus shown under the title, e.g. "Present tense · Greetings". */
  focus: string;
  location: string;
  title: { en: string; fr: string; zh: string };
  /** Card artwork. Undefined lessons fall back to a numbered placeholder. */
  image?: ImageSourcePropType;
  sections: Section[];
  vocabulary: Vocab[];
};

export const LESSONS: LessonContent[] = [
  {
    order: 1,
    level: "Beginner",
    focus: "Present tense · Simple sentences · Greetings",
    location: "Harare",
    title: {
      en: "Morning in Harare",
      fr: "Les rues du matin",
      zh: "哈拉雷的早晨",
    },
    image: require("@/assets/images/lessons/lesson_01_morning_in_harare (1).png"),
    sections: [
      {
        context: "Narration",
        english:
          "Tendai wakes up. The sun is rising. It is early morning in Harare.",
        french:
          "Tendai se réveille. Le soleil se lève. C'est le matin à Harare.",
        chinese: "滕代醒来了。太阳正在升起。是哈拉雷的清晨。",
      },
      {
        context: "Narration",
        english: "He hears a rooster. He hears a bus. He smells food cooking.",
        french:
          "Il entend un coq. Il entend un bus. Il sent la nourriture qui cuit.",
        chinese: "他听到了公鸡。他听到了公共汽车。他闻到了菜的香味。",
      },
      {
        context: "Narration",
        english: "He washes his face. He puts on his shirt. He goes outside.",
        french: "Il se lave le visage. Il met sa chemise. Il sort dehors.",
        chinese: "他洗了脸。他穿上衬衫。他走出室外。",
      },
      {
        context: "Narration",
        english:
          "The street is quiet. The sky is orange. It is a beautiful morning.",
        french: "La rue est calme. Le ciel est orange. C'est un beau matin.",
        chinese: "街道很安静。天空是橙色的。是美丽的早晨。",
      },
      {
        context: "Narration",
        english: "Tendai walks. He is happy. He likes mornings in Harare.",
        french: "Tendai marche. Il est heureux. Il aime les matins à Harare.",
        chinese: "滕代走着。他很高兴。他喜欢哈拉雷的早晨。",
      },
    ],
    vocabulary: [
      {
        english: "wakes up",
        french: "se réveille",
        chinese: "醒来",
        note: "to stop sleeping",
      },
      {
        english: "sun",
        french: "soleil",
        chinese: "太阳",
        note: "the star that gives us light",
      },
      {
        english: "morning",
        french: "matin",
        chinese: "早晨",
        note: "the early part of the day",
      },
      {
        english: "street",
        french: "rue",
        chinese: "街道",
        note: "a road in a city",
      },
      {
        english: "shirt",
        french: "chemise",
        chinese: "衬衫",
        note: "clothing for the upper body",
      },
      {
        english: "walk",
        french: "marcher",
        chinese: "走路",
        note: "to move on foot",
      },
    ],
  },
  {
    order: 2,
    level: "Beginner",
    focus: "Simple dialogue · Numbers · Buying things",
    location: "City Street",
    title: {
      en: "The Newspaper Man",
      fr: "Le vendeur de journaux",
      zh: "报纸小贩",
    },
    image: require("@/assets/images/lessons/lesson_02_newspaper_man (1).png"),
    sections: [
      {
        context: "Narration",
        english:
          "Tendai sees a man. The man sells newspapers. He stands on the street.",
        french:
          "Tendai voit un homme. L'homme vend des journaux. Il est debout dans la rue.",
        chinese: "滕代看到一个男人。那个男人卖报纸。他站在街上。",
      },
      {
        context: "Narration",
        english:
          "Tendai stops. He wants a newspaper. He takes one dollar from his pocket.",
        french:
          "Tendai s'arrête. Il veut un journal. Il prend un dollar dans sa poche.",
        chinese: "滕代停下来。他想要一份报纸。他从口袋里拿出一美元。",
      },
      {
        context: "Tendai",
        english: "Give me a newspaper, please. How much?",
        french: "Donnez-moi un journal, s'il vous plaît. C'est combien ?",
        chinese: "给我一份报纸。多少钱？",
      },
      {
        context: "Newspaper Man",
        english: "One dollar. Here you are.",
        french: "Un dollar. Voilà.",
        chinese: "一美元。给你。",
      },
      {
        context: "Tendai",
        english: "What is the news today?",
        french: "Quelles sont les nouvelles aujourd'hui ?",
        chinese: "今天有什么新闻？",
      },
      {
        context: "Newspaper Man",
        english:
          "Same as yesterday. Someone is stealing. Someone is crying. And we are all going to work.",
        french:
          "Pareil qu'hier. Quelqu'un vole. Quelqu'un pleure. Et nous allons tous travailler.",
        chinese: "和昨天一样。有人在偷，有人在哭，我们都去上班。",
      },
      {
        context: "Narration",
        english: "Tendai laughs. He takes the newspaper. He walks on.",
        french: "Tendai rit. Il prend le journal. Il continue à marcher.",
        chinese: "滕代笑了。他拿起报纸，继续走。",
      },
    ],
    vocabulary: [
      {
        english: "newspaper",
        french: "journal",
        chinese: "报纸",
        note: "printed news, sold daily",
      },
      {
        english: "buy",
        french: "acheter",
        chinese: "买",
        note: "to pay money for something",
      },
      {
        english: "today",
        french: "aujourd'hui",
        chinese: "今天",
        note: "this day",
      },
      {
        english: "give",
        french: "donner",
        chinese: "给",
        note: "to hand something to someone",
      },
      {
        english: "dollar",
        french: "dollar",
        chinese: "美元",
        note: "a unit of money",
      },
      {
        english: "world",
        french: "monde",
        chinese: "世界",
        note: "everywhere; all countries",
      },
    ],
  },
  {
    order: 3,
    level: "Beginner–Elementary",
    focus: "Colours & quantities · Describing places · Past tense introduced",
    location: "Mbare Market",
    title: {
      en: "Mbare Market Arrives",
      fr: "Le marché de Mbare",
      zh: "姆巴雷市场",
    },
    image: require("@/assets/images/lessons/lesson_03_mbare_market.png"),
    sections: [
      {
        context: "Narration",
        english:
          "Tendai took a bus to Mbare. He arrived at the market. The market was already busy.",
        french:
          "Tendai a pris un bus pour Mbare. Il est arrivé au marché. Le marché était déjà animé.",
        chinese: "滕代坐公共汽车去了姆巴雷。他到了市场。市场已经很热闹了。",
      },
      {
        context: "Narration",
        english:
          "He saw many colours. Red tomatoes. Yellow bananas. Green vegetables. Brown dried fish.",
        french:
          "Il a vu beaucoup de couleurs. Des tomates rouges. Des bananes jaunes. Des légumes verts. Du poisson séché brun.",
        chinese:
          "他看到了很多颜色。红色的西红柿。黄色的香蕉。绿色的蔬菜。棕色的干鱼。",
      },
      {
        context: "Narration",
        english:
          "He smelled spices and smoke. He heard voices and music. The market was alive.",
        french:
          "Il a senti des épices et de la fumée. Il a entendu des voix et de la musique. Le marché était vivant.",
        chinese: "他闻到了香料和烟的气味。他听到了声音和音乐。市场充满了生机。",
      },
      {
        context: "Narration",
        english:
          "He walked slowly. He had forty dollars in his pocket. He needed three things: tomatoes for his mother, a phone charger, and shoes for a wedding.",
        french:
          "Il a marché lentement. Il avait quarante dollars dans sa poche. Il avait besoin de trois choses : des tomates pour sa mère, un chargeur, et des chaussures pour un mariage.",
        chinese:
          "他慢慢地走着。他口袋里有四十美元。他需要三样东西：给妈妈的西红柿、充电器，和参加婚礼的鞋子。",
      },
      {
        context: "Thinking",
        english: "Forty dollars. Three things. I must be careful.",
        french: "Quarante dollars. Trois choses. Je dois faire attention.",
        chinese: "四十美元。三样东西。我必须小心。",
      },
    ],
    vocabulary: [
      {
        english: "market",
        french: "marché",
        chinese: "市场",
        note: "a place where people sell things",
      },
      {
        english: "tomato",
        french: "tomate",
        chinese: "西红柿",
        note: "a red round vegetable",
      },
      {
        english: "crowded",
        french: "bondé",
        chinese: "拥挤的",
        note: "full of many people",
      },
      {
        english: "arrived",
        french: "est arrivé",
        chinese: "到了",
        note: "came to a place (past)",
      },
      {
        english: "smell",
        french: "odeur",
        chinese: "气味",
        note: "what your nose detects",
      },
      {
        english: "stall",
        french: "étal",
        chinese: "摊位",
        note: "a table where things are sold",
      },
    ],
  },
  {
    order: 4,
    level: "Elementary",
    focus:
      "Past & present together · Character description · Expressing opinions",
    location: "Mbare Market",
    title: {
      en: "Ambuya Chipo's Tomatoes",
      fr: "Les tomates d'Ambuya Chipo",
      zh: "奇波奶奶的西红柿",
    },
    image: require("@/assets/images/lessons/lesson_04_ambuya_chipo.png"),
    sections: [
      {
        context: "Narration",
        english:
          "Ambuya Chipo was seventy years old. She had a face full of lines, like a map. Her eyes saw everything.",
        french:
          "Ambuya Chipo avait soixante-dix ans. Son visage était plein de rides, comme une carte. Ses yeux voyaient tout.",
        chinese: "奇波奶奶七十岁了。脸上布满皱纹，像一张地图。眼睛能看到一切。",
      },
      {
        context: "Narration",
        english:
          "She had known Tendai since he was a child. She recognised him immediately when he came to her stall.",
        french:
          "Elle connaissait Tendai depuis qu'il était enfant. Elle l'a reconnu immédiatement quand il est venu à son étal.",
        chinese: "她从小就认识滕代。当他来到摊位时，立刻认出了他。",
      },
      {
        context: "Ambuya Chipo",
        english:
          "Tendai! Look at you! You are so tall now. Did your mother send you?",
        french:
          "Tendai ! Regarde-toi ! Tu es si grand maintenant. Ta mère t'a envoyé ?",
        chinese: "滕代！看看你！你长这么高了。是你妈妈叫你来的？",
      },
      {
        context: "Tendai",
        english:
          "Yes, Ambuya. She wants good tomatoes. From your garden, not from the trucks.",
        french:
          "Oui, Ambuya. Elle veut de bonnes tomates. De votre jardin, pas des camions.",
        chinese: "是的，奶奶。她想要您花园里的西红柿，不是卡车来的那种。",
      },
      {
        context: "Ambuya Chipo",
        english:
          "Smart boy. Your mother raised you well. Take these tomatoes. Five dollars.",
        french:
          "Garçon intelligent. Ta mère t'a bien élevé. Prends ces tomates. Cinq dollars.",
        chinese: "聪明的孩子。你妈妈把你教得很好。拿这些西红柿。五美元。",
      },
      {
        context: "Ambuya Chipo",
        english:
          "Tell your mother she must visit me before Christmas — or I will come to her house and embarrass her!",
        french:
          "Dis à ta mère qu'elle doit me rendre visite avant Noël — sinon j'irai chez elle l'embarrasser !",
        chinese: "告诉你妈妈圣诞前要来看我——不然我去她家让她难堪！",
      },
      {
        context: "Narration",
        english:
          "Tendai smiled. He paid five dollars. He put the tomatoes carefully in his bag.",
        french:
          "Tendai a souri. Il a payé cinq dollars. Il a mis les tomates soigneusement dans son sac.",
        chinese: "滕代微笑了。他付了五美元，小心地把西红柿放进包里。",
      },
    ],
    vocabulary: [
      {
        english: "wise",
        french: "sage",
        chinese: "聪明的",
        note: "having good judgement from experience",
      },
      {
        english: "recognise",
        french: "reconnaître",
        chinese: "认出",
        note: "to know someone you have seen before",
      },
      {
        english: "garden",
        french: "jardin",
        chinese: "花园",
        note: "a place where plants grow",
      },
      {
        english: "truck",
        french: "camion",
        chinese: "卡车",
        note: "a large vehicle that carries goods",
      },
      {
        english: "embarrass",
        french: "embarrasser",
        chinese: "让人难堪",
        note: "to make someone feel awkward",
      },
      {
        english: "raised",
        french: "a élevé",
        chinese: "养大",
        note: "brought up a child (past tense)",
      },
    ],
  },
  {
    order: 5,
    level: "Elementary–Intermediate",
    focus: "Negotiation language · Humour & irony · Compound sentences",
    location: "Kwame Nkrumah Ave",
    title: {
      en: "Zhou Wei & the Charger",
      fr: "Zhou Wei et le chargeur",
      zh: "周炜与充电器",
    },
    image: require("@/assets/images/lessons/lesson_05_zhou_wei.png"),
    sections: [
      {
        context: "Narration",
        english:
          "On Kwame Nkrumah Avenue, Tendai found the electronics street. A young man was calling out to everyone who passed.",
        french:
          "Sur l'avenue Kwame Nkrumah, Tendai a trouvé la rue des électroniques. Un jeune homme interpellait tous ceux qui passaient.",
        chinese:
          "在恩克鲁玛大道上，滕代找到了电子产品一条街。一个年轻人对每个路过的人喊着。",
      },
      {
        context: "Narration",
        english:
          "His name was Zhou Wei — twenty-four, from Guangzhou. He had been in Harare for three years. He spoke Shona with a Chinese accent, and used this to his advantage.",
        french:
          "Il s'appelait Zhou Wei — vingt-quatre ans, de Guangzhou. Il était à Harare depuis trois ans. Il parlait le shona avec un accent chinois, et s'en servait à son avantage.",
        chinese:
          "他叫周炜——二十四岁，来自广州。他在哈拉雷住了三年。他说带中国口音的绍纳语，并以此为优势。",
      },
      {
        context: "Zhou Wei",
        english:
          "Hey boss! Charger? Cable? Earphones? Chinese price, American quality!",
        french:
          "Hé patron ! Chargeur ? Câble ? Écouteurs ? Prix chinois, qualité américaine !",
        chinese: "嘿，老板！充电器？数据线？耳机？中国价格，美国质量！",
      },
      {
        context: "Tendai",
        english:
          "Which is it? Chinese quality or American quality? You must choose one and commit, brother.",
        french:
          "C'est lequel ? Qualité chinoise ou qualité américaine ? Tu dois en choisir une et t'y engager, mon frère.",
        chinese: "到底哪个？中国质量还是美国质量？你必须选一个坚持，兄弟。",
      },
      {
        context: "Zhou Wei",
        english:
          "For you, my friend — both. Chinese price AND American quality. A special Harare deal. You cannot find this anywhere else.",
        french:
          "Pour toi, mon ami — les deux. Prix chinois ET qualité américaine. Une offre spéciale Harare. Tu ne trouveras ça nulle part ailleurs.",
        chinese:
          "为你，我的朋友——两个都有。中国价格加美国质量。这是哈拉雷特惠。你在别处找不到。",
      },
      {
        context: "Narration",
        english:
          "They argued for ten minutes about football. They agreed on nothing, but parted as friends. Tendai paid three dollars. The charger cost five in the shop nearby.",
        french:
          "Ils ont débattu du football pendant dix minutes. Ils n'étaient d'accord sur rien, mais se sont quittés en amis. Tendai a payé trois dollars. Le chargeur coûtait cinq dans la boutique d'à côté.",
        chinese:
          "他们争论了十分钟足球。什么都没达成共识，却成了朋友。滕代付了三美元。旁边店里的充电器要五美元。",
      },
    ],
    vocabulary: [
      {
        english: "entrepreneur",
        french: "entrepreneur",
        chinese: "创业者",
        note: "someone who runs their own business",
      },
      {
        english: "accent",
        french: "accent",
        chinese: "口音",
        note: "the way someone pronounces words",
      },
      {
        english: "negotiate",
        french: "négocier",
        chinese: "谈判",
        note: "to discuss a price until both agree",
      },
      {
        english: "commit",
        french: "s'engager",
        chinese: "坚持",
        note: "to stay firm in a decision",
      },
      {
        english: "quality",
        french: "qualité",
        chinese: "质量",
        note: "how good something is",
      },
      {
        english: "charger",
        french: "chargeur",
        chinese: "充电器",
        note: "a device that powers a phone",
      },
    ],
  },
  {
    order: 6,
    level: "Intermediate",
    focus: "Reported speech · Conditional sentences · Longer descriptions",
    location: "First Street",
    title: {
      en: "Marguerite and the Shoes",
      fr: "Marguerite et les chaussures",
      zh: "玛格丽特与鞋子",
    },
    image: require("@/assets/images/lessons/lesson_06_marguerite.png"),
    sections: [
      {
        context: "Narration",
        english:
          "Behind the First Street Mall, there was a narrow lane. It smelled of leather and ambition.",
        french:
          "Derrière le First Street Mall, il y avait une ruelle étroite. Elle sentait le cuir et l'ambition.",
        chinese: "第一街购物中心后面有一条窄巷，弥漫着皮革和野心的气息。",
      },
      {
        context: "Narration",
        english:
          "Tendai was looking at brown shoes when he heard a voice speaking French. A woman of about thirty wore a yellow blazer and was pulling a suitcase that had been to many airports.",
        french:
          "Tendai regardait des chaussures marron quand il a entendu une voix parler français. Une femme d'une trentaine d'années portait un blazer jaune et tirait une valise qui avait visité beaucoup d'aéroports.",
        chinese:
          "滕代正在看棕色的鞋子，这时他听到一个说法语的声音。一位约三十岁的女士穿着黄色西装，拖着一个走过很多机场的行李箱。",
      },
      {
        context: "Marguerite",
        english: "Vous parlez français? You speak French?",
        french: "Vous parlez français ?",
        chinese: "Vous parlez français？你会说法语？",
      },
      {
        context: "Tendai",
        english:
          "Un peu. A little. I am still learning — from an app, old French films, and a woman at work from Kinshasa.",
        french:
          "Un peu. J'apprends encore — d'une application, de vieux films français, et d'une collègue de Kinshasa.",
        chinese:
          "Un peu。一点点。我还在学——从一个应用程序，从老法国电影，有一位来自金沙萨的同事。",
      },
      {
        context: "Narration",
        english:
          "Marguerite was a journalist from Lyon, writing about informal economies. He offered a deal: if she helped him negotiate the shoes, he would show her the best places to photograph.",
        french:
          "Marguerite était journaliste à Lyon, elle écrivait sur les économies informelles. Il a proposé un marché : si elle l'aidait à négocier les chaussures, il lui montrerait les meilleurs endroits pour photographier.",
        chinese:
          "玛格丽特是来自里昂的记者，来写非正式经济的文章。他提出交换：如果她帮他谈鞋价，他就带她去最佳拍摄地点。",
      },
      {
        context: "Tendai",
        english:
          "The vendor can see I want these shoes. If you ask the price, he will not know that. He cannot read your eyes.",
        french:
          "Le vendeur peut voir que je veux ces chaussures. Si vous demandez le prix, il ne le saura pas. Il ne peut pas lire dans vos yeux.",
        chinese:
          "卖家能看出我非常想要这双鞋。如果你来问价格，他就不会知道这一点。他读不懂你的眼神。",
      },
      {
        context: "Narration",
        english:
          "Twenty minutes later, the shoes were his — six dollars, four below the asking price. Marguerite had her photographs. They exchanged numbers and made two promises.",
        french:
          "Vingt minutes plus tard, les chaussures étaient à lui — six dollars, quatre en dessous du prix demandé. Marguerite avait ses photographies. Ils ont échangé leurs numéros et fait deux promesses.",
        chinese:
          "二十分钟后，鞋子归他了——六美元，比要价便宜四美元。玛格丽特拍到了她的照片。他们交换了号码，许下两个承诺。",
      },
    ],
    vocabulary: [
      {
        english: "journalist",
        french: "journaliste",
        chinese: "记者",
        note: "a person who writes news stories",
      },
      {
        english: "negotiate",
        french: "négocier",
        chinese: "谈判",
        note: "to agree on a price by discussion",
      },
      {
        english: "condition",
        french: "condition",
        chinese: "条件",
        note: "a requirement before agreeing",
      },
      {
        english: "desperate",
        french: "désespéré",
        chinese: "迫切的",
        note: "very urgently wanting something",
      },
      {
        english: "authentic",
        french: "authentique",
        chinese: "真实的",
        note: "genuinely real, not fake",
      },
      {
        english: "resilience",
        french: "résilience",
        chinese: "韧性",
        note: "the ability to recover from difficulties",
      },
    ],
  },
  {
    order: 7,
    level: "Intermediate",
    focus: "Setting a scene · Indirect speech · Expressing philosophy",
    location: "Nelson Mandela Ave",
    title: {
      en: "Mama Rudo's Restaurant",
      fr: "Le restaurant de Mama Rudo",
      zh: "鲁多的餐厅",
    },
    sections: [
      {
        context: "Narration",
        english:
          "Tendai was hungry. He walked to Mama Rudo's restaurant on Nelson Mandela Avenue. The restaurant had no sign outside — only a small chalkboard painted by hand. It said: EAT WELL. PAY WHAT YOU CAN.",
        french:
          "Tendai avait faim. Il a marché jusqu'au restaurant de Mama Rudo sur Nelson Mandela Avenue. Le restaurant n'avait pas d'enseigne — seulement un petit tableau peint à la main : MANGEZ BIEN. PAYEZ CE QUE VOUS POUVEZ.",
        chinese:
          "滕代饿了。他走到纳尔逊·曼德拉大道上鲁多妈妈的餐厅。餐厅外没有招牌——只有一块手写黑板：吃好，量力而付。",
      },
      {
        context: "Narration",
        english:
          "Inside, there were four tables. The food was always the same: sadza, vegetables, and whatever meat had arrived that morning. There was no menu because the food was already perfect.",
        french:
          "À l'intérieur, il y avait quatre tables. La nourriture était toujours la même : sadza, légumes, et la viande qui était arrivée ce matin-là. Il n'y avait pas de menu parce que la nourriture était déjà parfaite.",
        chinese:
          "里面有四张桌子。食物总是一样的：玉米糊、蔬菜，还有当天早上送来的肉。没有菜单，因为食物本身已经完美了。",
      },
      {
        context: "Narration",
        english:
          "At the shared table sat Professor Ndlovu — a man who had taught philosophy at the University of Zimbabwe for thirty-five years.",
        french:
          "À la table commune était assis le Professeur Ndlovu — un homme qui avait enseigné la philosophie à l'Université du Zimbabwe pendant trente-cinq ans.",
        chinese:
          "公共餐桌旁坐着恩德洛武教授，他在津巴布韦大学教了三十五年哲学。",
      },
      {
        context: "Professor Ndlovu",
        english:
          "You are carrying many things, young man. But which of those things is actually carrying you?",
        french:
          "Vous portez beaucoup de choses, jeune homme. Mais laquelle de ces choses vous porte vraiment ?",
        chinese: "年轻人，你携带着很多东西。但是，其中哪样东西在承载着你呢？",
      },
      {
        context: "Tendai",
        english: "Good afternoon to you too, Professor.",
        french: "Bonne après-midi à vous aussi, Professeur.",
        chinese: "下午好，教授。",
      },
      {
        context: "Professor Ndlovu",
        english:
          "Ha! Good. You still have your manners. Sit. The sadza today is extraordinary. Mama Rudo used peanut butter — without telling anyone — and she achieved something close to genius.",
        french:
          "Ha ! Bien. Vous avez encore vos manières. Asseyez-vous. La sadza aujourd'hui est extraordinaire. Mama Rudo a utilisé du beurre de cacahuètes — sans le dire à personne — et elle a atteint quelque chose proche du génie.",
        chinese:
          "哈！好。你还有礼貌。坐下。今天的玉米糊非同凡响。鲁多妈妈用了花生酱——没有告诉任何人——达到了近乎天才的境界。",
      },
      {
        context: "Narration",
        english:
          "Tendai sat. They ate in comfortable silence. Then the professor said something Tendai would not forget for a long time.",
        french:
          "Tendai s'est assis. Ils ont mangé dans un silence confortable. Puis le professeur a dit quelque chose que Tendai n'oublierait pas avant longtemps.",
        chinese:
          "滕代坐下了。他们在舒适的沉默中一起吃饭。然后教授说了一些滕代很久都不会忘记的话。",
      },
    ],
    vocabulary: [
      {
        english: "sign",
        french: "enseigne",
        chinese: "招牌",
        note: "a board with words giving information",
      },
      {
        english: "retire",
        french: "prendre sa retraite",
        chinese: "退休",
        note: "to stop working permanently",
      },
      {
        english: "extraordinary",
        french: "extraordinaire",
        chinese: "非凡的",
        note: "very unusual and impressive",
      },
      {
        english: "genius",
        french: "génie",
        chinese: "天才",
        note: "great natural ability",
      },
      {
        english: "companions",
        french: "compagnons",
        chinese: "同伴",
        note: "people you spend time with",
      },
      {
        english: "announce",
        french: "annoncer",
        chinese: "宣布",
        note: "to say something officially",
      },
    ],
  },
  {
    order: 8,
    level: "Upper-Intermediate",
    focus: "Abstract ideas · Questions & reflection · Longer monologue",
    location: "Mama Rudo's",
    title: {
      en: "The Professor's Question",
      fr: "La question du professeur",
      zh: "教授的问题",
    },
    image: require("@/assets/images/lessons/lesson_08_professor_question.png"),
    sections: [
      {
        context: "Professor Ndlovu",
        english:
          "Do you know what Harare has that most cities in the world have lost?",
        french:
          "Savez-vous ce que Harare possède et que la plupart des villes du monde ont perdu ?",
        chinese: "你知道哈拉雷有而大多数城市已失去的是什么？",
      },
      {
        context: "Tendai",
        english: "Potholes?",
        french: "Des nids-de-poule ?",
        chinese: "坑洼路？",
      },
      {
        context: "Professor Ndlovu",
        english:
          "Ha! Yes, certainly potholes. But also this: conversation between strangers. Real conversation. Not performing for each other, not checking phones. Actually talking.",
        french:
          "Ha ! Oui, certainement des nids-de-poule. Mais aussi ceci : la conversation entre étrangers. Une vraie conversation. Pas se donner en spectacle, pas regarder son téléphone. Vraiment parler.",
        chinese:
          "哈！是的，当然有坑洼路。但还有：陌生人之间的对话。真正的对话。不是互相表演，不是看手机。是真正地交流。",
      },
      {
        context: "Narration",
        english:
          "The professor said that in the great cities of Europe and America, people had stopped talking to strangers — not because they were unfriendly, but because they had been taught to fear each other. The city had become a collection of private worlds moving past each other without touching.",
        french:
          "Le professeur a dit que dans les grandes villes d'Europe et d'Amérique, les gens avaient arrêté de parler aux étrangers — non parce qu'ils étaient hostiles, mais parce qu'on leur avait appris à se craindre les uns les autres. La ville était devenue une collection de mondes privés qui se croisaient sans se toucher.",
        chinese:
          "教授说，在欧美的大城市，人们已经停止和陌生人交流——不是因为不友好，而是因为被教会了互相恐惧。城市成了一个个私人世界的集合，擦肩而过，却从不相触。",
      },
      {
        context: "Professor Ndlovu",
        english:
          "But here, this morning — you talked to the newspaper man, to Ambuya Chipo, you spoke French with a stranger from Lyon, you argued about football with a young man from Guangzhou. Harare is one of the few cities where a person can still have five real conversations in a single morning. When we stop talking to strangers, we stop thinking.",
        french:
          "Mais ici, ce matin — vous avez parlé au vendeur de journaux, à Ambuya Chipo, vous avez parlé français avec une inconnue de Lyon, vous avez débattu du football avec un jeune homme de Guangzhou. Harare est l'une des rares villes où une personne peut encore avoir cinq vraies conversations en une seule matinée. Quand nous cessons de parler aux étrangers, nous cessons de penser.",
        chinese:
          "但在这里，今天早上——你和报纸小贩交谈，和奇波奶奶交谈，你和一位来自里昂的陌生人说法语，你和一位来自广州的年轻人争论足球。哈拉雷是少数几个人们还能在一个上午进行五次真正对话的城市之一。当我们停止和陌生人交流，我们就停止了思考。",
      },
      {
        context: "Narration",
        english:
          "Tendai counted. The newspaper man. Ambuya Chipo. Zhou Wei. Marguerite. The professor himself. Five conversations. Exactly five. He had not planned any of them.",
        french:
          "Tendai a compté. Le vendeur de journaux. Ambuya Chipo. Zhou Wei. Marguerite. Le professeur lui-même. Cinq conversations. Exactement cinq. Il n'en avait planifié aucune.",
        chinese:
          "滕代数了数。报纸小贩、奇波奶奶、周炜、玛格丽特、教授本人。五次对话。正好五次。他没有计划其中任何一次。",
      },
    ],
    vocabulary: [
      {
        english: "conversation",
        french: "conversation",
        chinese: "对话",
        note: "a talk between two or more people",
      },
      {
        english: "stranger",
        french: "étranger",
        chinese: "陌生人",
        note: "a person you do not know",
      },
      {
        english: "protect",
        french: "protéger",
        chinese: "保护",
        note: "to keep something safe from harm",
      },
      {
        english: "informal",
        french: "informel",
        chinese: "非正式的",
        note: "not official; not following strict rules",
      },
      {
        english: "democracy",
        french: "démocratie",
        chinese: "民主",
        note: "a system where people vote for leaders",
      },
      {
        english: "inheritance",
        french: "héritage",
        chinese: "遗产",
        note: "something passed down from those before",
      },
    ],
  },
  {
    order: 9,
    level: "Advanced",
    focus: "Reflection & metaphor · Complex clauses · Narrative voice",
    location: "Harare Drive",
    title: { en: "The Ride Home", fr: "Le kombi du retour", zh: "回家的小巴" },
    image: require("@/assets/images/lessons/lesson_09_ride_home.png"),
    sections: [
      {
        context: "Narration",
        english:
          'On the kombi ride home, Tendai held his bag and scrolled through the photographs Marguerite had sent — with a message that said only: "For your memory."',
        french:
          "Dans le kombi du retour, Tendai tenait son sac et faisait défiler les photographies que Marguerite lui avait envoyées — avec un message qui disait seulement : « Pour ta mémoire. »",
        chinese:
          "在回家的小巴上，滕代抱着包，翻看玛格丽特发来的照片——附上一条消息：「留作记忆。」",
      },
      {
        context: "Narration",
        english:
          "There was the shoe vendor's face — caught mid-laugh. There was Zhou Wei, mid-sentence, arms full of cables. There was Ambuya Chipo's hands around a tomato, the skin on her knuckles telling a story her mouth would never bother with.",
        french:
          "Il y avait le visage du vendeur de chaussures — saisi en plein rire. Il y avait Zhou Wei, au milieu d'une phrase, les bras pleins de câbles. Il y avait les mains d'Ambuya Chipo autour d'une tomate, la peau sur ses articulations racontant une histoire que sa bouche ne daignerait jamais raconter.",
        chinese:
          "有鞋主的脸——笑到一半被抓拍到。有周炜，说话到一半，手臂抱着数据线。有奇波奶奶捧着西红柿的双手——指关节上的皮肤述说着嘴上从不多说的故事。",
      },
      {
        context: "Narration",
        english:
          "He thought about the professor's simpler question beneath the grand statement: which of the things you are carrying is actually carrying you?",
        french:
          "Il pensait à la question plus simple du professeur sous la grande déclaration : laquelle des choses que vous portez vous porte vraiment ?",
        chinese:
          "他想起了教授那番宏大言论背后更简单的问题：你所携带的那些东西中，究竟哪个在承载着你？",
      },
      {
        context: "Narration",
        english:
          "The kombi hit a pothole on Harare Drive. The whole vehicle lurched sideways. Every person inside reached for whatever was nearest — a stranger's arm, a seat back, a plastic handle dangling from the roof.",
        french:
          "Le kombi a heurté un nid-de-poule sur Harare Drive. Tout le véhicule a fait un écart sur le côté. Chaque personne à l'intérieur a saisi ce qui était le plus proche — le bras d'un inconnu, un dossier de siège, une poignée en plastique pendant du plafond.",
        chinese:
          "小巴在哈拉雷大道上碰上了一个坑洼。整车猛地向一侧晃了一下。每个人都抓住了最近的东西——陌生人的手臂、椅背、从顶部垂下的塑料把手。",
      },
      {
        context: "Narration",
        english:
          "For one moment, fifteen people who had never met were briefly, necessarily, touching each other. Someone laughed first. Then someone else. Then everyone — the universal language of people who have just nearly fallen together.",
        french:
          "Pendant un instant, quinze personnes qui ne s'étaient jamais rencontrées se touchaient, brièvement, nécessairement. Quelqu'un a ri le premier. Puis quelqu'un d'autre. Puis tout le monde — le langage universel des gens qui ont failli tomber ensemble.",
        chinese:
          "在那一刻，十五个素未谋面的人短暂而不可避免地接触在了一起。有人先笑了。然后又有人。然后所有人——差点一起摔倒的人的世界通用语言。",
      },
    ],
    vocabulary: [
      {
        english: "scroll",
        french: "faire défiler",
        chinese: "滑动",
        note: "to move through images on a screen",
      },
      {
        english: "lurched",
        french: "a fait un écart",
        chinese: "猛地一晃",
        note: "moved suddenly and unevenly",
      },
      {
        english: "handhold",
        french: "point d'appui",
        chinese: "扶手",
        note: "something to grip for balance",
      },
      {
        english: "necessarily",
        french: "nécessairement",
        chinese: "必然地",
        note: "in a way that could not be avoided",
      },
      {
        english: "resilience",
        french: "résilience",
        chinese: "韧性",
        note: "recovering strongly from difficulty",
      },
      {
        english: "informal economy",
        french: "économie informelle",
        chinese: "非正式经济",
        note: "trade outside official systems",
      },
    ],
  },
  {
    order: 10,
    level: "Advanced",
    focus: "Full narrative voice · Thematic resolution · Idiomatic language",
    location: "Home",
    title: {
      en: "Five Conversations",
      fr: "Cinq conversations",
      zh: "五次对话",
    },
    image: require("@/assets/images/lessons/lesson_10_five_conversations.png"),
    sections: [
      {
        context: "Narration",
        english:
          "There is a particular quality to the light in Harare at the end of an afternoon in the dry season — the way it lies flat and golden along the top of the jacaranda canopies, as though the day itself has finally exhaled.",
        french:
          "Il y a une qualité particulière dans la lumière de Harare à la fin d'un après-midi en saison sèche — la façon dont elle s'étend, plate et dorée, au sommet des jacarandas, comme si la journée elle-même avait enfin expiré.",
        chinese:
          "在旱季的下午，哈拉雷的光有一种独特的质地——平铺金黄，覆盖在花楹树冠的顶端，仿佛这一天终于呼出了最后一口气。",
      },
      {
        context: "Narration",
        english:
          "Tendai walked the last block home with his bag heavy and his mind light. He had entered the city that morning as a person with a list; he was leaving it as something less tidy and more interesting.",
        french:
          "Tendai a marché le dernier pâté de maisons jusqu'à chez lui, le sac lourd et l'esprit léger. Il était entré dans la ville ce matin comme une personne avec une liste ; il la quittait comme quelque chose de moins ordonné et de plus intéressant.",
        chinese:
          "滕代背着沉甸甸的包，轻松地走完了回家的最后一个街区。今天早上他是带着一张清单进城的；他带着更不整洁、也更有趣的东西离开了。",
      },
      {
        context: "Narration",
        english:
          "He thought about the newspaper man who had summarised the world in eleven words. About Ambuya Chipo, who had known him before he had known himself. About Zhou Wei, who had turned selling a charger into a philosophical position. About Marguerite, who had crossed an ocean looking for the informal economy and found the thing underneath it.",
        french:
          "Il pensa au vendeur de journaux qui avait résumé le monde en onze mots. À Ambuya Chipo, qui l'avait connu avant qu'il se connaisse lui-même. À Zhou Wei, qui avait transformé la vente d'un chargeur en position philosophique. À Marguerite, qui avait traversé un océan à la recherche de l'économie informelle et avait trouvé la chose en dessous.",
        chinese:
          "他想起了用十一个字概括了整个世界的报纸小贩。想起了在他认识自己之前就认识他的奇波奶奶。想起了把卖充电器变成哲学立场的周炜。想起了漂洋过海来寻找非正式经济、却找到了它底下那样东西的玛格丽特。",
      },
      {
        context: "Narration",
        english:
          "He did not have an answer to the professor's question. But he had learned that the question was the point. That you had to keep walking for the answer to find you.",
        french:
          "Il n'avait pas de réponse à la question du professeur. Mais il avait appris que la question était l'essentiel. Qu'il fallait continuer à marcher pour que la réponse vous trouve.",
        chinese:
          "他没有答案来回答教授的问题。但他学到了——问题本身才是关键所在。你必须继续走，答案才能找到你。",
      },
      {
        context: "His mother",
        english: "Did you get the tomatoes?",
        french: "Tu as pris les tomates ?",
        chinese: "你买到西红柿了？",
      },
      {
        context: "Tendai",
        english: "I got the tomatoes. And the charger. And the shoes.",
        french: "J'ai pris les tomates. Et le chargeur. Et les chaussures.",
        chinese: "买到了。还有充电器和鞋子。",
      },
      {
        context: "His mother",
        english: "And Ambuya Chipo?",
        french: "Et Ambuya Chipo ?",
        chinese: "奇波奶奶呢？",
      },
      {
        context: "Tendai",
        english:
          "Brown. Oxford. Six dollars. She sends her love and says you had better visit before Christmas — or she will come here and embarrass you.",
        french:
          "Marron. Oxford. Six dollars. Elle envoie son amour et dit que tu ferais mieux de lui rendre visite avant Noël — sinon elle viendra ici t'embarrasser.",
        chinese:
          "棕色。牛津鞋。六美元。她问你好，说你最好在圣诞前去看她——不然她会来这里让你难堪。",
      },
      {
        context: "Narration",
        english:
          "His mother laughed. It was the same laugh as his — warm, rolling, the kind that spread without asking permission. Outside, the jacarandas were dark against an orange sky. Somewhere on Harare Drive, a kombi was hitting a pothole, and someone — there is always someone — was starting to laugh.",
        french:
          "Sa mère a ri. C'était le même rire que le sien — chaleureux, roulant, le genre qui se répand sans demander la permission. Dehors, les jacarandas étaient sombres contre un ciel orange. Quelque part sur Harare Drive, un kombi heurtait un nid-de-poule, et quelqu'un — il y a toujours quelqu'un — commençait à rire.",
        chinese:
          "他的妈妈笑了。那笑声和他的一样——温暖的，滚动的，那种不需要请求许可就会蔓延开来的笑声。屋外，花楹树在橙色天空的映衬下一片墨黑。哈拉雷大道的某处，一辆小巴正在碾过一个坑洼，有一个人——总是有人——开始笑了起来。",
      },
    ],
    vocabulary: [
      {
        english: "unplanned",
        french: "imprévu",
        chinese: "计划外的",
        note: "not arranged or prepared in advance",
      },
      {
        english: "fleeting",
        french: "fugace",
        chinese: "短暂的",
        note: "lasting only a short time",
      },
      {
        english: "encounter",
        french: "rencontre",
        chinese: "相遇",
        note: "a meeting, especially unexpected",
      },
      {
        english: "deliberately",
        french: "délibérément",
        chinese: "故意地",
        note: "on purpose; intentionally",
      },
      {
        english: "vernacular",
        french: "vernaculaire",
        chinese: "地方语言",
        note: "the language of ordinary people",
      },
      {
        english: "worth",
        french: "qui vaut la peine",
        chinese: "值得",
        note: "deserving of; good enough for",
      },
    ],
  },
];
