import { 
  FiCode, 
  FiPenTool, 
  FiSmartphone, 
  FiShoppingCart, 
  FiSettings, 
  FiBookOpen, 
  FiZap, 
  FiLayers, 
  FiLink2 
} from "react-icons/fi";

export type ITService = {
  id: string;
  title: string;
  desc: string;
  iconKey: string;
  Icon: any;
  image: { src: string; alt: string };
  bullets: string[];
  longDesc?: string;
};

export const itServices: ITService[] = [
  {
    id: "web-development",
    title: "Web Development",
    desc: "High-performance, SEO-optimized web applications using Next.js and React.",
    iconKey: "code",
    Icon: FiCode,
    image: { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80", alt: "Web development" },
    bullets: ["Next.js & React expert builds", "Server-side rendering (SSR)", "API-first architecture", "High-performance optimization"],
    longDesc: "Our web development team specializes in building modern, scalable, and secure web applications. We leverage the power of Next.js and React to deliver lightning-fast user experiences. From enterprise-grade SaaS platforms to high-traffic consumer websites, we ensure your digital presence is built on a foundation of clean code and optimized performance."
  },
  {
    id: "ui-ux",
    title: "UI / UX Design",
    desc: "User-centric design that converts. Intuitive interfaces and engaging experiences.",
    iconKey: "pentool",
    Icon: FiPenTool,
    image: { src: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=1600&q=80", alt: "UI/UX design" },
    bullets: ["User journey mapping", "High-fidelity prototyping", "Responsive design systems", "Accessibility (WCAG) compliance"],
    longDesc: "Design is more than just aesthetics; it's about solving problems and creating seamless interactions. Our UI/UX design process begins with deep user research and competitive analysis. We then move through wireframing, interactive prototyping, and visual design, ensuring every pixel serves a purpose and every interaction is intuitive."
  },
  {
    id: "mobile-development",
    title: "Mobile App Development",
    desc: "Fluid, responsive, and feature-rich native and cross-platform mobile apps.",
    iconKey: "smartphone",
    Icon: FiSmartphone,
    image: { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80", alt: "Mobile app development" },
    bullets: ["iOS & Android native apps", "Flutter & React Native", "Offline-first capability", "Secure cloud sync"],
    longDesc: "In a mobile-first world, your application needs to be fast, reliable, and engaging. We build mobile apps that feel at home on any platform. Whether it's a high-performance native iOS app or a cost-effective cross-platform Flutter application, we focus on delivering a consistent and polished experience that users love."
  },
  {
    id: "ecommerce",
    title: "E-commerce Development",
    desc: "Scalable online stores built for growth. From Shopify to Headless Commerce.",
    iconKey: "shoppingcart",
    Icon: FiShoppingCart,
    image: { src: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80", alt: "E-commerce development" },
    bullets: ["Custom Shopify/Magento builds", "Secure payment integrations", "Inventory management sync", "Conversion rate optimization"],
    longDesc: "We build e-commerce platforms that drive revenue. Our expertise ranges from customizing leading platforms like Shopify and Magento to developing complex headless commerce solutions. We focus on creating smooth checkout flows, secure payment integrations, and robust inventory management systems that scale with your business."
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    desc: "Tailored business logic to solve specific challenges. SaaS and internal tools.",
    iconKey: "settings",
    Icon: FiSettings,
    image: { src: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1600&q=80", alt: "Custom software development" },
    bullets: ["SaaS platform engineering", "Internal workflow tools", "Legacy system modernization", "Microservices architecture"],
    longDesc: "Off-the-shelf software often fails to meet the unique needs of a growing business. We build custom software solutions that are tailored to your specific workflows. Whether you need a complex SaaS platform, a bespoke internal management tool, or a modernization of your legacy systems, our engineers deliver scalable and maintainable code."
  },
  {
    id: "edtech-lms",
    title: "EdTech & LMS Development",
    desc: "Specialized platforms for education. LMS, assessment engines, and learning tools.",
    iconKey: "bookopen",
    Icon: FiBookOpen,
    image: { src: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1600&q=80", alt: "EdTech and LMS development" },
    bullets: ["LMS & LXP development", "SCORM/LTI integrations", "Assessment & quiz engines", "Student progress tracking"],
    longDesc: "Nexografix has deep roots in the education sector. We build learning management systems (LMS) and learning experience platforms (LXP) that are engaging and pedagogically sound. Our solutions include assessment engines, interactive learning materials, and robust tracking systems that comply with industry standards like SCORM and LTI."
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    desc: "LLM integration and intelligent automation workflows to future-proof your business.",
    iconKey: "zap",
    Icon: FiZap,
    image: { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80", alt: "AI and automation" },
    bullets: ["LLM & GPT integrations", "Process automation (RPA)", "Intelligent chatbots", "Data-driven insights"],
    longDesc: "Artificial Intelligence is transforming how businesses operate. We help you stay ahead of the curve by integrating AI into your existing workflows. From building custom chatbots powered by LLMs to automating repetitive manual processes, we enable your team to focus on high-value tasks while AI handles the heavy lifting."
  },
  {
    id: "cms-dam",
    title: "CMS / DAM / Content Systems",
    desc: "Structured content for scale. Headless CMS and Digital Asset Management.",
    iconKey: "layers",
    Icon: FiLayers,
    image: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80", alt: "CMS and DAM systems" },
    bullets: ["Headless CMS implementation", "DAM system integration", "Multi-channel distribution", "SEO-friendly content models"],
    longDesc: "Efficiently managing content at scale requires a structured approach. We implement headless CMS solutions (like Contentful, Strapi, or Sanity) that allow you to deliver content across multiple channels from a single source. Our DAM integrations ensure your digital assets are organized, searchable, and easily accessible across your organization."
  },
  {
    id: "integrations",
    title: "API & Integrations",
    desc: "Connect your digital ecosystem with custom APIs and third-party service sync.",
    iconKey: "link2",
    Icon: FiLink2,
    image: { src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&w=1600&q=80", alt: "API and integrations" },
    bullets: ["REST & GraphQL API design", "Third-party service sync", "Legacy ERP/CRM integrations", "Secure data orchestration"],
    longDesc: "Data silos are the enemy of efficiency. We build custom APIs and integrate third-party services to ensure your data flows seamlessly across your entire digital ecosystem. Whether it's connecting your CRM to your marketing automation tool or building a custom gateway for your mobile app, we handle the complexity of data orchestration."
  }
];
