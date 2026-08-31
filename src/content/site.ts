export const LOCALES = ['en', 'zh-cn'] as const;

export const SITE_TITLE = 'Lopleec Personal Web / Lopleec个人网站';

export type Locale = (typeof LOCALES)[number];
export type ContrastMode = 'standard' | 'high';
export type RouteKey =
  | 'home'
  | 'about-me'
  | 'now'
  | 'fun'
  | 'projects'
  | 'skills'
  | 'award'
  | 'links';

export type LocalizedText = Record<Locale, string>;

export type PlaceholderPageCopy = {
  description: string;
  title: string;
};

export type ProjectLinkCopy = {
  href: string;
  label: string;
  type: 'github' | 'website' | 'external';
};

export type ProjectCardCopy = {
  description: string;
  githubRepo?: string;
  links: ProjectLinkCopy[];
  name: string;
};

export type AwardEntryCopy = {
  description: string;
  name: string;
  note: string;
  rank: string;
};

export type LinksSectionCopy = {
  items: Array<{
    href?: string;
    label?: string;
    text: string;
  }>;
  title: string;
};

export type SkillLevelCopy = {
  label: string;
  percent: number;
};

export type SkillGroupCopy = {
  items: SkillLevelCopy[];
  title: string;
};

export type SiteCopy = {
  about: {
    facts: Array<{ answer: string; question: string }>;
    factsNote: string;
    introTitle: string;
    kicker: string;
    paragraphs: string[];
    quote: string;
    quoteBy: string;
    title: string;
    interestingFactTitle: string;
  };
  cards: {
    award: string;
    copied: string;
    email: string;
    githubAria: string;
    introDescription: string;
    introTitle: string;
    learnMore: string;
    linksAria: string;
    nowBigWord: string;
    nowSubtitle: string;
    projects: string;
    sayHi: string;
    sayHiDescription: string;
    skills: string;
  };
  awardPage: {
    items: AwardEntryCopy[];
    title: string;
  };
  footer: {
    afterInter: string;
    afterSecond: string;
    copyright: string;
    intro: string;
    middle: string;
  };
  fun: {
    homeAria: string;
  };
  hero: {
    avatarAlt: string;
    greeting: string;
    names: string[];
    subtitleLines: [string, string];
  };
  linksPage: {
    sections: LinksSectionCopy[];
    title: string;
  };
  mobileNotice: {
    continue: string;
    copied: string;
    copy: string;
    message: string;
    url: string;
  };
  notFound: {
    description: string;
    heading: string;
    homeAria: string;
  };
  nowPage: {
    items: string[];
    title: string;
  };
  projectsPage: {
    items: ProjectCardCopy[];
    title: string;
  };
  skillsPage: {
    nextAria: string;
    previousAria: string;
    hint: string;
    groups: SkillGroupCopy[];
    title: string;
  };
  pageTitles: Record<RouteKey, string>;
  placeholders: Record<Exclude<RouteKey, 'about-me' | 'fun' | 'home'>, PlaceholderPageCopy>;
  settings: {
    contrast: string;
    contrastHint: string;
    english: string;
    high: string;
    language: string;
    settings: string;
    simplifiedChinese: string;
    standard: string;
  };
};

export const DEFAULT_LOCALE: Locale = 'en';

export const ROUTE_SLUGS: Record<RouteKey, string> = {
  home: '',
  'about-me': 'about-me',
  now: 'now',
  fun: 'fun',
  projects: 'projects',
  skills: 'skills',
  award: 'award',
  links: 'links',
};

const SLUG_TO_ROUTE = Object.entries(ROUTE_SLUGS).reduce<Record<string, RouteKey>>(
  (map, [routeKey, slug]) => {
    map[slug] = routeKey as RouteKey;
    return map;
  },
  { '': 'home' },
);

export const TITLE_TRANSLATIONS: Record<RouteKey, LocalizedText> = {
  home: {
    en: 'Home',
    'zh-cn': '首页',
  },
  'about-me': {
    en: 'About Me',
    'zh-cn': '关于我',
  },
  now: {
    en: 'Now',
    'zh-cn': '现在',
  },
  fun: {
    en: 'Fun',
    'zh-cn': '有趣',
  },
  projects: {
    en: 'Projects',
    'zh-cn': '项目',
  },
  skills: {
    en: 'Skills',
    'zh-cn': '技能',
  },
  award: {
    en: 'Award',
    'zh-cn': '奖项',
  },
  links: {
    en: 'Links',
    'zh-cn': '链接',
  },
};

export const SITE_COPY: Record<Locale, SiteCopy> = {
  en: {
    about: {
      facts: [
        {
          question: 'Q: What music do you like?',
          answer: "A: C418's music.",
        },
        {
          question: 'Q: What Game do you play?',
          answer:
            'A: Minecraft, Stardew Valley, Unturned, Slay the Spire 2, Balatro etc.',
        },
        {
          question: 'Q: In which year were you born?',
          answer: 'A: 2012 =)',
        },
      ],
      factsNote:
        'More Fact Updating... (If you have any questions, feel free to email me)',
      introTitle: 'Introduction',
      interestingFactTitle: 'Interesting Fact',
      kicker: 'About Me',
      paragraphs: [
        "I’m a young person born in Beijing and grew up around technology, games, and the internet. I’ve always been curious about how things work, and programming became a way for me to turn ideas into real, working projects.",
        'I build open-source projects and enjoy exploring AI, machine learning, LLM fine-tuning, AI agents, and developer tools. I like understanding what happens under the surface, not just using technology at a surface level. To me, building things is also a way to learn: each project gives me a clearer view of how software, systems, and people interact.',
        'I have also participated in hackathons, where I enjoy building quickly, solving problems under time pressure, and turning rough ideas into something usable.',
        'Games are another big part of what I like. I enjoy game development, pixel art, and music production, because they bring code, design, sound, and imagination together. I like how a game can become a small world, built from both logic and creativity.',
        'I am more introverted than outgoing, and I value independent thinking, deep thinking, and quiet focus. I usually prefer spending time researching, building, and slowly forming my own understanding of things instead of simply following trends.',
        'I am still learning and still building. I want to keep following my curiosity, trying new ideas, and making projects that feel meaningful to me.',
      ],
      quote:
        'The people who are crazy enough to think they can change the world are the ones who do.',
      quoteBy: 'by Steve Jobs',
      title: 'About Me',
    },
    cards: {
      award: 'AWARD',
      copied: 'Copied!',
      email: 'Email',
      githubAria: 'Open Lopleec GitHub profile',
      introDescription:
        'I am a high school student from Beijing China. I like AI, Machine learning, dev small tools, Game dev, make music and of course play video games. I have a very strong curiosity on everything.',
      introTitle: "Hi, I'm Lopleec.",
      learnMore: 'Learn more',
      linksAria: 'Open links page',
      nowBigWord: 'What',
      nowSubtitle: 'am I doing now?',
      projects: 'PROJECT',
      sayHi: 'Say hi!',
      sayHiDescription:
        "Contact me if you are looking for collaboration, or it's cool to just say hi too :)",
      skills: 'Skills',
    },
    awardPage: {
      title: 'AWARD',
      items: [
        {
          name: 'Personal Web',
          description: 'Create A best personal web in the world.',
          rank: 'NaN th place',
          note: 'Placeholder',
        },
      ],
    },
    linksPage: {
      title: 'LINKS',
      sections: [
        {
          title: 'MY SOCIAL MEDIA',
          items: [
            {
              label: 'Bilibili',
              text: 'https://space.bilibili.com/3493127828540221',
              href: 'https://space.bilibili.com/3493127828540221',
            },
            {
              label: 'YouTube',
              text: 'https://www.youtube.com/@Lopleec',
              href: 'https://www.youtube.com/@Lopleec',
            },
            {
              label: 'X',
              text: 'https://x.com/Lopleec',
              href: 'https://x.com/Lopleec',
            },
            {
              label: 'Github',
              text: 'https://github.com/lopleec',
              href: 'https://github.com/lopleec',
            },
            {
              label: 'Reddit',
              text: 'https://www.reddit.com/user/lopleec',
              href: 'https://www.reddit.com/user/lopleec',
            },
          ],
        },
        {
          title: 'MY STARS LINK',
          items: [{ text: 'updating...' }],
        },
        {
          title: 'FRIENDS PERSONAL WEB',
          items: [
            {
              text: 'https://jiangmuran.com',
              href: 'https://jiangmuran.com',
            },
            {
              text: 'https://www.awaioi.com',
              href: 'https://www.awaioi.com',
            },
          ],
        },
      ],
    },
    footer: {
      afterInter: '. If there are any copyright issues, please contact for deletion.',
      afterSecond:
        '. Build with Typescript, React and Vite. Icons are akar-icons. Fonts use are Bungee_Hairline, MuseoModerno, Orbitron from Google Font and Inter4.1 from ',
      copyright:
        '© 2026 Lopleec. Website content all right reserved. Code licensed under MIT where available.',
      intro: 'This website referenced ',
      middle: ' & ',
    },
    fun: {
      homeAria: 'Back to home page',
    },
    hero: {
      avatarAlt: 'Lopleec avatar',
      greeting: "Hi, I'm",
      names: ['Lopleec', 'Lucca Zhang'],
      subtitleLines: ['DESIGNING & BUILDING', 'COOL LIFE'],
    },
    mobileNotice: {
      continue: 'Continue anyway',
      copied: 'Copied',
      copy: 'Copy URL',
      message:
        'Mobile adaptation is not ideal. I strongly recommend visiting this site on a computer.',
      url: 'https://www.lopleec.com',
    },
    notFound: {
      description:
        'The page you are looking for was moved, removed, renamed, or might never have existed.',
      heading: 'Something is wrong',
      homeAria: 'Back to home page',
    },
    nowPage: {
      items: [
        'TRAIN MODELS',
        'MAKE MUSIC',
        'DEV GAMES',
        'CHAT',
        'PLAY MINECRAFT',
        'GO TO SCHOOL',
      ],
      title: 'NOW',
    },
    projectsPage: {
      title: 'PROJECT',
      items: [
        {
          name: 'Gepo-MCSkin-Pixel-EDM',
          githubRepo: 'lopleec/Gepo-MCSkin-Pixel-EDM',
          description:
            'Gepo is a 217.8M-parameter pixel-space EDM with UV-aware conditioning (a text-conditioned pixel-space diffusion model) that generates native 64×64 RGBA Minecraft skins from English text.',
          links: [
            {
              href: 'https://github.com/lopleec/Gepo-MCSkin-Pixel-EDM',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://huggingface.co/Lopleec/Gepo-MCSkin-Pixel-EDM',
              label: 'Hugging Face',
              type: 'external',
            },
          ],
        },
        {
          name: 'Kotj',
          githubRepo: 'lopleec/Kotj',
          description: 'A clean note-taking app with a native Android UI.',
          links: [
            {
              href: 'https://github.com/lopleec/Kotj',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Pixel-Water-Mark',
          githubRepo: 'lopleec/Pixel-Water-Mark',
          description: 'An app for adding photo watermarks for Pixel devices.',
          links: [
            {
              href: 'https://github.com/lopleec/Pixel-Water-Mark',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Swift Craft Launcher',
          githubRepo: 'suhang12332/Swift-Craft-Launcher',
          description:
            'A native macOS Minecraft Java Edition launcher built with Swift and SwiftUI, with full features and an active community. I contribute to special features and overall promotion of the project.',
          links: [
            {
              href: 'https://github.com/suhang12332/Swift-Craft-Launcher',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://web.scl.isiah.top/',
              label: 'Website',
              type: 'website',
            },
          ],
        },
        {
          name: 'Sc',
          githubRepo: 'lopleec/Sc',
          description:
            'A macOS fullscreen multiplayer game chat app built on the IRC network, similar to the chat experience in Minecraft multiplayer servers.',
          links: [
            {
              href: 'https://github.com/lopleec/Sc',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Zz',
          githubRepo: 'lopleec/Zz',
          description:
            'A floating AI assistant that can independently think, plan tasks, and operate the computer desktop and files.',
          links: [
            {
              href: 'https://github.com/lopleec/Zz',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'L0ck',
          githubRepo: 'lopleec/L0ck',
          description:
            'A macOS app that can encrypt any file and aims for a high level of security. Detailed security analysis is available in the GitHub README.',
          links: [
            {
              href: 'https://github.com/lopleec/L0ck',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'GPT-In-Chrome',
          githubRepo: 'lopleec/GPT-in-Chrome',
          description:
            "Because I can't afford Claude (Anthropic) Pro, I built a Chrome extension that connects to my own API and enables full web interaction.",
          links: [
            {
              href: 'https://github.com/lopleec/GPT-in-Chrome',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Chorus',
          githubRepo: 'lopleec/Chorus',
          description:
            'A high-permission agent that fixes many of the problems in OpenClaw, such as memory/session handling, safety review, multi-agent workflows, and very long context. It is not yet a mature project.',
          links: [
            {
              href: 'https://github.com/lopleec/Chorus',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Trston',
          githubRepo: 'lopleec/Trston',
          description:
            'A local translation Chrome extension that does not depend on Google services.',
          links: [
            {
              href: 'https://github.com/lopleec/Trston',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'UTFFF',
          githubRepo: 'lopleec/UTFFF',
          description:
            'An entertainment-focused UTF input method: type UTF codes and output characters.',
          links: [
            {
              href: 'https://github.com/lopleec/UTFFF',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Lexicon',
          githubRepo: 'lopleec/Lexicon',
          description:
            'A minimal but feature-complete AI terminal, similar to ChatBox.',
          links: [
            {
              href: 'https://github.com/lopleec/Lexicon',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'LessAI',
          githubRepo: 'lopleec/LessAI',
          description:
            'A local anti-AI-detection algorithm. The result is not very good yet.',
          links: [
            {
              href: 'https://github.com/lopleec/LessAI',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'CopySouL',
          githubRepo: 'lopleec/CopySouL',
          description:
            'Import personality packs like plugins and talk with AI in that style. It also supports sending stickers such as PNG and GIF.',
          links: [
            {
              href: 'https://github.com/lopleec/CopySouL',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Lopleec Search',
          githubRepo: 'lopleec/Lopleec_Search',
          description: 'An aggregated search engine.',
          links: [
            {
              href: 'https://github.com/lopleec/Lopleec_Search',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://s.lopleec.com/',
              label: 'Website',
              type: 'website',
            },
          ],
        },
        {
          name: 'CogniCode',
          description:
            'A beginner-friendly programming learning website that teaches Python, C++, Java, logic, and more through a “guess first, then practice” approach.',
          links: [
            {
              href: 'https://code.lopleec.com/',
              label: 'Website',
              type: 'website',
            },
          ],
        },
        {
          name: 'WeChat Export',
          githubRepo: 'lopleec/wxchat-export',
          description:
            'A CLI tool written in Python for exporting WeChat chat history.',
          links: [
            {
              href: 'https://github.com/lopleec/wxchat-export',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'More Project',
          description:
            'This website is not updated in real time, so a few projects may be missing here. For the full list, please check GitHub.',
          links: [
            {
              href: 'https://github.com/lopleec',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
      ],
    },
    skillsPage: {
      title: 'Skills',
      hint: 'Use the buttons or arrow keys to explore my skills.',
      previousAria: 'Previous skill group',
      nextAria: 'Next skill group',
      groups: [
        {
          title: 'AI',
          items: [
            { label: 'VibeCoding', percent: 98 },
            { label: 'LLM Training', percent: 75 },
            { label: 'Prompt Engineering', percent: 89 },
            { label: 'APIs', percent: 99 },
          ],
        },
        {
          title: 'Code',
          items: [
            { label: 'Python', percent: 95 },
            { label: 'C++', percent: 85 },
            { label: 'Swift', percent: 96 },
            { label: 'Rust', percent: 70 },
            { label: 'Js', percent: 80 },
          ],
        },
        {
          title: 'Tools',
          items: [
            { label: 'Codex', percent: 100 },
            { label: 'VSCode', percent: 99 },
            { label: 'Github', percent: 90 },
            { label: 'Docker', percent: 78 },
            { label: 'Aseprite', percent: 90 },
            { label: 'Logic Pro', percent: 40 },
          ],
        },
        {
          title: 'OS',
          items: [
            { label: 'macOS', percent: 100 },
            { label: 'Ubuntu Desktop', percent: 80 },
            { label: 'Ubuntu Server', percent: 75 },
            { label: 'Windows', percent: 70 },
          ],
        },
        {
          title: 'Dev',
          items: [
            { label: 'Web', percent: 85 },
            { label: 'Game', percent: 90 },
            { label: 'macOS APP', percent: 89 },
          ],
        },
      ],
    },
    pageTitles: {
      home: 'Lopleec',
      'about-me': 'About Me | Lopleec',
      now: 'Now | Lopleec',
      fun: 'Fun | Lopleec',
      projects: 'Projects | Lopleec',
      skills: 'Skills | Lopleec',
      award: 'Award | Lopleec',
      links: 'Links | Lopleec',
    },
    placeholders: {
      now: {
        title: 'Now',
        description:
          "A running log of what I'm exploring, building, and thinking about right now.",
      },
      projects: {
        title: 'Projects',
        description:
          'A slower archive of projects, experiments, and finished work.',
      },
      skills: {
        title: 'Skills',
        description:
          'Notes on the tools, workflows, and technical areas I keep practicing.',
      },
      award: {
        title: 'Award',
        description:
          "A place for milestones, recognitions, and things I'm proud of.",
      },
      links: {
        title: 'Links',
        description:
          'A small collection of links, profiles, and places to find me online.',
      },
    },
    settings: {
      contrast: 'Contrast',
      contrastHint: 'High contrast increases text and color separation for easier reading. Accessibility features.',
      english: 'English',
      high: 'High',
      language: 'Language',
      settings: 'Settings',
      simplifiedChinese: '简体中文',
      standard: 'Standard',
    },
  },
  'zh-cn': {
    about: {
      facts: [
        {
          question: 'Q: 你喜欢什么音乐？',
          answer: 'A: C418 的音乐。',
        },
        {
          question: 'Q: 你会玩什么游戏？',
          answer:
            'A: Minecraft、Stardew Valley、Unturned、Slay the Spire 2、Balatro 等等。',
        },
        {
          question: 'Q: 你出生于哪一年？',
          answer: 'A: 2012 =)',
        },
      ],
      factsNote: '更多小事实持续更新中……（如果你有问题，欢迎给我发邮件）',
      introTitle: '简介',
      interestingFactTitle: '有趣的小事',
      kicker: '关于我',
      paragraphs: [
        '我是在北京出生长大的年轻人。科技、游戏和互联网几乎一直都在我的生活里，我也一直很好奇各种东西到底是怎么运作的。对我来说，编程成了把想法真正变成可运行项目的一种方式。',
        '我会做开源项目，也很喜欢探索 AI、机器学习、LLM 微调、AI Agents 和各种开发者工具。我希望理解技术表面之下真正发生了什么，而不只是停留在“会用”的层面。对我来说，做项目本身也是一种学习方式：每做一个项目，我都会更清楚地看到软件、系统和人之间是怎样相互作用的。',
        '我也参加过 Hackathon。我很喜欢那种快速推进的节奏、在时间压力下解决问题的感觉，以及把一个还很粗糙的想法在短时间里做成能用东西的过程。',
        '游戏也是我非常喜欢的一部分。我喜欢游戏开发、像素画和音乐制作，因为它们把代码、设计、声音和想象力放在了一起。我很喜欢游戏能成为一个由逻辑和创造力共同搭起来的小世界。',
        '比起外向，我更偏向内向一些。我很重视独立思考、深入思考和安静专注的状态。相比只是跟随趋势，我通常更喜欢花时间去研究、去搭建，再慢慢形成自己对事物的理解。',
        '我还在学习，也还在持续做东西。我想继续跟着自己的好奇心走，尝试新的想法，做出那些对我自己来说真正有意义的项目。',
      ],
      quote: '那些疯狂到以为自己能够改变世界的人，最终也的确改变了世界。',
      quoteBy: 'Steve Jobs',
      title: '关于我',
    },
    cards: {
      award: '奖项',
      copied: '已复制',
      email: '邮箱',
      githubAria: '打开 Lopleec 的 GitHub 主页',
      introDescription:
        '我是一个来自北京的高中生。我喜欢 AI、机器学习、开发小工具、游戏开发、做音乐，当然也喜欢玩游戏。我对很多事情都保持着很强的好奇心。',
      introTitle: '你好，我是 Lopleec。',
      learnMore: '了解更多',
      linksAria: '打开链接页面',
      nowBigWord: '最近',
      nowSubtitle: '我现在在做什么？',
      projects: '项目',
      sayHi: '来打个招呼！',
      sayHiDescription:
        '如果你想合作，或者只是想聊聊，也欢迎直接来找我。',
      skills: '技能',
    },
    awardPage: {
      title: '奖项',
      items: [
        {
          name: 'Personal Web',
          description: '创建世界上最好的个人网站。',
          rank: 'NaN 名',
          note: '占位',
        },
      ],
    },
    linksPage: {
      title: '链接',
      sections: [
        {
          title: '我的社交媒体',
          items: [
            {
              label: 'Bilibili',
              text: 'https://space.bilibili.com/3493127828540221',
              href: 'https://space.bilibili.com/3493127828540221',
            },
            {
              label: 'YouTube',
              text: 'https://www.youtube.com/@Lopleec',
              href: 'https://www.youtube.com/@Lopleec',
            },
            {
              label: 'X',
              text: 'https://x.com/Lopleec',
              href: 'https://x.com/Lopleec',
            },
            {
              label: 'Github',
              text: 'https://github.com/lopleec',
              href: 'https://github.com/lopleec',
            },
            {
              label: 'Reddit',
              text: 'https://www.reddit.com/user/lopleec',
              href: 'https://www.reddit.com/user/lopleec',
            },
          ],
        },
        {
          title: '我的星标链接',
          items: [{ text: '更新中...' }],
        },
        {
          title: '朋友们的个人网站',
          items: [
            {
              text: 'https://jiangmuran.com',
              href: 'https://jiangmuran.com',
            },
            {
              text: 'https://www.awaioi.com',
              href: 'https://www.awaioi.com',
            },
          ],
        },
      ],
    },
    footer: {
      afterInter: '。如有任何版权问题，请联系删除。',
      afterSecond:
        '。使用 Typescript、React 和 Vite 构建。图标来自 akar-icons。字体使用 Google Font 的 Bungee_Hairline、MuseoModerno、Orbitron，以及来自 ',
      copyright:
        '© 2026 Lopleec。网站内容保留所有权利。代码在可用处采用 MIT 许可。',
      intro: '本网站参考了 ',
      middle: ' 与 ',
    },
    fun: {
      homeAria: '返回主页',
    },
    hero: {
      avatarAlt: 'Lopleec 头像',
      greeting: '嗨，我是',
      names: ['Lopleec', 'Lucca Zhang'],
      subtitleLines: ['设计并构建', '酷生活'],
    },
    mobileNotice: {
      continue: '继续访问',
      copied: '已复制',
      copy: '复制网址',
      message: '移动端适配不佳，强烈建议您使用电脑访问。',
      url: 'https://www.lopleec.com',
    },
    notFound: {
      description:
        '你访问的页面可能已经被移动、删除、改名，或者从来就不存在。',
      heading: '这里似乎出了点问题',
      homeAria: '返回主页',
    },
    nowPage: {
      items: [
        '训练模型',
        '做音乐',
        '开发游戏',
        '聊天',
        '玩我的世界',
        '去上学',
      ],
      title: '现在',
    },
    projectsPage: {
      title: '项目',
      items: [
        {
          name: 'Gepo-MCSkin-Pixel-EDM',
          githubRepo: 'lopleec/Gepo-MCSkin-Pixel-EDM',
          description:
            'Gepo 是一个 2.178 亿参数的像素空间 EDM，并结合 UV 感知条件（文本条件像素空间扩散模型），可从英文文本生成原生 64×64 RGBA Minecraft 皮肤。',
          links: [
            {
              href: 'https://github.com/lopleec/Gepo-MCSkin-Pixel-EDM',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://huggingface.co/Lopleec/Gepo-MCSkin-Pixel-EDM',
              label: 'Hugging Face',
              type: 'external',
            },
          ],
        },
        {
          name: 'Kotj',
          githubRepo: 'lopleec/Kotj',
          description: '一款采用 Android 原生 UI 的简洁记事本软件。',
          links: [
            {
              href: 'https://github.com/lopleec/Kotj',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Pixel-Water-Mark',
          githubRepo: 'lopleec/Pixel-Water-Mark',
          description: '一款为 Pixel 设备照片添加水印的软件。',
          links: [
            {
              href: 'https://github.com/lopleec/Pixel-Water-Mark',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Swift Craft Launcher',
          githubRepo: 'suhang12332/Swift-Craft-Launcher',
          description:
            '这是一款 macOS 原生、由 Swift 和 SwiftUI 开发的 Minecraft Java 版启动器，有着完整的功能和活跃社区。我担任此项目的特殊贡献和整体宣传工作。',
          links: [
            {
              href: 'https://github.com/suhang12332/Swift-Craft-Launcher',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://web.scl.isiah.top/',
              label: '官网',
              type: 'website',
            },
          ],
        },
        {
          name: 'Sc',
          githubRepo: 'lopleec/Sc',
          description:
            '一款基于 IRC 网络的 macOS 全屏多人游戏聊天软件，类似 Minecraft 多人游戏里的聊天功能。',
          links: [
            {
              href: 'https://github.com/lopleec/Sc',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Zz',
          githubRepo: 'lopleec/Zz',
          description:
            '一款能够完全独立思考、规划任务，并操控电脑桌面和文件的悬浮 AI 助手。',
          links: [
            {
              href: 'https://github.com/lopleec/Zz',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'L0ck',
          githubRepo: 'lopleec/L0ck',
          description:
            '一款能够加密任意文件并保证较高安全性的 macOS 软件，具体安全分析详见 GitHub Readme。',
          links: [
            {
              href: 'https://github.com/lopleec/L0ck',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'GPT-In-Chrome',
          githubRepo: 'lopleec/GPT-in-Chrome',
          description:
            '因为本人买不起 Claude（Anthropic）Pro，所以做了一款 Chrome 插件，能够接入自己的 API 来实现完整的网页操作能力。',
          links: [
            {
              href: 'https://github.com/lopleec/GPT-in-Chrome',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Chorus',
          githubRepo: 'lopleec/Chorus',
          description:
            '一款解决了很多 OpenClaw 问题的高权限 Agent，比如记忆 / Session、安全审查、多 Agent、超长上下文 / 超高成本等，但它还不是成熟项目。',
          links: [
            {
              href: 'https://github.com/lopleec/Chorus',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Trston',
          githubRepo: 'lopleec/Trston',
          description:
            '一款不使用 Google 服务的本地翻译 Chrome 插件。',
          links: [
            {
              href: 'https://github.com/lopleec/Trston',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'UTFFF',
          githubRepo: 'lopleec/UTFFF',
          description:
            '一款用于娱乐的 UTF 输入法，即输入 UTF 编码输出字符。',
          links: [
            {
              href: 'https://github.com/lopleec/UTFFF',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Lexicon',
          githubRepo: 'lopleec/Lexicon',
          description:
            '极简但功能完整的 AI 终端，类似 ChatBox。',
          links: [
            {
              href: 'https://github.com/lopleec/Lexicon',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'LessAI',
          githubRepo: 'lopleec/LessAI',
          description:
            '本地降 AI 率算法，效果并不好。',
          links: [
            {
              href: 'https://github.com/lopleec/LessAI',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'CopySouL',
          githubRepo: 'lopleec/CopySouL',
          description:
            '能够像导入插件一样导入人格包并与 AI 对话，AI 将使用人格包中的风格进行回复，也可以发送 PNG、GIF 等表情包。',
          links: [
            {
              href: 'https://github.com/lopleec/CopySouL',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'Lopleec Search',
          githubRepo: 'lopleec/Lopleec_Search',
          description: '聚合搜索。',
          links: [
            {
              href: 'https://github.com/lopleec/Lopleec_Search',
              label: 'GitHub',
              type: 'github',
            },
            {
              href: 'https://s.lopleec.com/',
              label: '网站',
              type: 'website',
            },
          ],
        },
        {
          name: 'CogniCode',
          description:
            '一个小白学编程的网站，通过先猜测后实践的方式去学习 Python、C++、Java、逻辑等等。',
          links: [
            {
              href: 'https://code.lopleec.com/',
              label: '网站',
              type: 'website',
            },
          ],
        },
        {
          name: 'WeChat Export',
          githubRepo: 'lopleec/wxchat-export',
          description:
            '一款由 Python 开发的 CLI 微信聊天记录导出工具。',
          links: [
            {
              href: 'https://github.com/lopleec/wxchat-export',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
        {
          name: 'More Project',
          description:
            '本网站不是实时更新的，所以会有个别项目未在此处列出，完整内容请查看 GitHub。',
          links: [
            {
              href: 'https://github.com/lopleec',
              label: 'GitHub',
              type: 'github',
            },
          ],
        },
      ],
    },
    skillsPage: {
      title: '技能',
      hint: '点击按钮或使用键盘左右键查看我的技能。',
      previousAria: '上一个技能分类',
      nextAria: '下一个技能分类',
      groups: [
        {
          title: 'AI',
          items: [
            { label: 'VibeCoding', percent: 98 },
            { label: 'LLM训练', percent: 75 },
            { label: 'Prompt Engineering', percent: 89 },
            { label: 'APIs', percent: 99 },
          ],
        },
        {
          title: '代码',
          items: [
            { label: 'Python', percent: 95 },
            { label: 'C++', percent: 85 },
            { label: 'Swift', percent: 96 },
            { label: 'Rust', percent: 70 },
            { label: 'Js', percent: 80 },
          ],
        },
        {
          title: '工具',
          items: [
            { label: 'Codex', percent: 100 },
            { label: 'VSCode', percent: 99 },
            { label: 'Github', percent: 90 },
            { label: 'Docker', percent: 78 },
            { label: 'Aseprite', percent: 90 },
            { label: 'Logic Pro', percent: 40 },
          ],
        },
        {
          title: '系统',
          items: [
            { label: 'macOS', percent: 100 },
            { label: 'Ubuntu Desktop', percent: 80 },
            { label: 'Ubuntu Server', percent: 75 },
            { label: 'Windows', percent: 70 },
          ],
        },
        {
          title: '开发',
          items: [
            { label: 'Web', percent: 85 },
            { label: 'Game', percent: 90 },
            { label: 'macOS APP', percent: 89 },
          ],
        },
      ],
    },
    pageTitles: {
      home: 'Lopleec',
      'about-me': '关于我 | Lopleec',
      now: '现在 | Lopleec',
      fun: '有趣的东西 | Lopleec',
      projects: '项目 | Lopleec',
      skills: '技能 | Lopleec',
      award: '奖项 | Lopleec',
      links: '链接 | Lopleec',
    },
    placeholders: {
      now: {
        title: '现在',
        description: '这里会记录我最近在探索、搭建和思考的东西。',
      },
      projects: {
        title: '项目',
        description: '这里会慢慢整理我的项目、实验和已经完成的作品。',
      },
      skills: {
        title: '技能',
        description: '这里会记录我持续练习的工具、工作流和技术方向。',
      },
      award: {
        title: '奖项',
        description: '这里会整理里程碑、奖项，以及我想留下来的重要时刻。',
      },
      links: {
        title: '链接',
        description: '这里会放一些链接、个人主页和能找到我的地方。',
      },
    },
    settings: {
      contrast: '对比度',
      contrastHint: '高对比度会增强文字和颜色之间的区分，方便阅读。无障碍功能。',
      english: 'English',
      high: '高',
      language: '语言',
      settings: '设置',
      simplifiedChinese: '简体中文',
      standard: '标准',
    },
  },
};

export type ResolvedPath = {
  canonicalPath: string;
  isKnownRoute: boolean;
  locale: Locale;
  rawSlug: string;
  routeKey: RouteKey | 'not-found';
};

export const buildLocalizedPath = (locale: Locale, routeKey: RouteKey) => {
  const slug = ROUTE_SLUGS[routeKey];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
};

export const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};

export const resolvePathname = (
  pathname: string,
  preferredLocale: Locale = DEFAULT_LOCALE,
): ResolvedPath => {
  const normalized = normalizePathname(pathname);
  const segments = normalized.split('/').filter(Boolean);
  const leadingSegment = segments[0];
  const hasLocalePrefix = LOCALES.includes(leadingSegment as Locale);
  const locale = hasLocalePrefix ? (leadingSegment as Locale) : preferredLocale;
  const slugSegments = hasLocalePrefix ? segments.slice(1) : segments;
  const rawSlug = slugSegments.join('/');
  const routeKey = SLUG_TO_ROUTE[rawSlug];

  if (routeKey) {
    return {
      canonicalPath: buildLocalizedPath(locale, routeKey),
      isKnownRoute: true,
      locale,
      rawSlug,
      routeKey,
    };
  }

  const canonicalPath = rawSlug ? `/${locale}/${rawSlug}` : `/${locale}`;

  return {
    canonicalPath,
    isKnownRoute: false,
    locale,
    rawSlug,
    routeKey: 'not-found',
  };
};

export const switchLocalePath = (pathname: string, nextLocale: Locale) => {
  const resolved = resolvePathname(pathname, nextLocale);
  if (resolved.routeKey === 'not-found') {
    return resolved.rawSlug ? `/${nextLocale}/${resolved.rawSlug}` : `/${nextLocale}`;
  }

  return buildLocalizedPath(nextLocale, resolved.routeKey);
};
