import {
    FaNodeJs, FaReact, FaAws, FaPython, FaGit, FaDocker, FaDatabase, FaHtml5,
    FaCss3Alt, FaSass, FaPhp, FaLaravel, FaJava, FaVuejs, FaAngular, FaSwift,
    FaFigma, FaWordpress, FaShopify, FaMicrosoft, FaSalesforce, FaCloud,
    FaCogs, FaTerminal, FaRobot, FaNetworkWired, FaAndroid, FaApple, FaCodeBranch,
    FaBug, FaServer, FaShieldAlt, FaCuttlefish, FaGoogle, FaSlack, FaTrello
  } from "react-icons/fa";
  
  import {
    SiMongodb, SiTypescript, SiFlutter, SiOpenai, SiKubernetes,
    SiPostgresql, SiMysql, SiFirebase, SiNextdotjs, SiNestjs, SiDjango,
    SiFlask, SiTensorflow, SiPytorch, SiJupyter, SiFastapi, SiWebpack, SiRabbitmq,
    SiKakao, SiElasticsearch, SiRedis, SiHiveBlockchain, SiEthereum, SiSolidity, SiVercel,
    SiNetlify, SiJenkins, SiCircleci, SiGithubactions, SiCloudflare, SiHeroku, SiDigitalocean,
    SiSupabase, SiLinux, SiBitbucket, SiCypress, SiRedux, SiTrello, SiNotion, SiPostman,
    SiGraphql, SiSentry, SiTailwindcss, SiBootstrap, SiExpress
  } from "react-icons/si";
  
  const skillIcons: any = {
    // Backend Technologies
    "Node.js": <FaNodeJs className="text-4xl" />,
    "Express.js": <SiExpress className="text-4xl" />,
    "GraphQL": <SiGraphql className="text-4xl" />,
    "NestJS": <SiNestjs className="text-4xl" />,
    "Django": <SiDjango className="text-4xl" />,
    "Flask": <SiFlask className="text-4xl" />,
    "FastAPI": <SiFastapi className="text-4xl" />,
    
    // Frontend Technologies
    "React": <FaReact className="text-4xl" />,
    "Next.js": <SiNextdotjs className="text-4xl" />,
    "Vue.js": <FaVuejs className="text-4xl" />,
    "Angular": <FaAngular className="text-4xl" />,
    "Redux": <SiRedux className="text-4xl" />,
    "Material UI": <SiWebpack className="text-4xl" />,
    "TailwindCSS": <SiTailwindcss className="text-4xl" />,
    "Bootstrap": <SiBootstrap className="text-4xl" />,
    
    // Mobile Development
    "Flutter": <SiFlutter className="text-4xl" />,
    "Swift": <FaSwift className="text-4xl" />,
    "Kotlin": <FaAndroid className="text-4xl" />,
    "React Native": <FaReact className="text-4xl" />,
    
    // DevOps & Cloud
    "AWS": <FaAws className="text-4xl" />,
    "Azure": <FaMicrosoft className="text-4xl" />,
    "Google Cloud": <FaGoogle className="text-4xl" />,
    "Docker": <FaDocker className="text-4xl" />,
    "Kubernetes": <SiKubernetes className="text-4xl" />,
    "Jenkins": <SiJenkins className="text-4xl" />,
    "CircleCI": <SiCircleci className="text-4xl" />,
    "GitHub Actions": <SiGithubactions className="text-4xl" />,
    "Cloudflare": <SiCloudflare className="text-4xl" />,
    "Heroku": <SiHeroku className="text-4xl" />,
    "DigitalOcean": <SiDigitalocean className="text-4xl" />,
    "Supabase": <SiSupabase className="text-4xl" />,
    
    // Databases
    "MongoDB": <SiMongodb className="text-4xl" />,
    "PostgreSQL": <SiPostgresql className="text-4xl" />,
    "MySQL": <SiMysql className="text-4xl" />,
    "Firebase": <SiFirebase className="text-4xl" />,
    "Elasticsearch": <SiElasticsearch className="text-4xl" />,
    "Redis": <SiRedis className="text-4xl" />,
    
    // Programming Languages
    "Python": <FaPython className="text-4xl" />,
    "TypeScript": <SiTypescript className="text-4xl" />,
    "JavaScript": <FaCodeBranch className="text-4xl" />,
    "Java": <FaJava className="text-4xl" />,
    "C#": <FaCodeBranch className="text-4xl" />,
    "Go": <FaCodeBranch className="text-4xl" />,
    "Rust": <FaCodeBranch className="text-4xl" />,
    "PHP": <FaPhp className="text-4xl" />,
    "Laravel": <FaLaravel className="text-4xl" />,
    "C++": <FaCodeBranch className="text-4xl" />,
    
    // AI/ML & Data Science
    "OpenAI": <SiOpenai className="text-4xl" />,
    "TensorFlow": <SiTensorflow className="text-4xl" />,
    "PyTorch": <SiPytorch className="text-4xl" />,
    "Jupyter": <SiJupyter className="text-4xl" />,
    
    // Blockchain & Web3
    "Blockchain": <SiHiveBlockchain className="text-4xl" />,
    "Ethereum": <SiEthereum className="text-4xl" />,
    "Solidity": <SiSolidity className="text-4xl" />,
    
    // UI/UX & Design
    "Figma": <FaFigma className="text-4xl" />,
    "Adobe XD": <FaFigma className="text-4xl" />,
    "Photoshop": <FaFigma className="text-4xl" />,
    
    // Productivity & Collaboration
    "Slack": <FaSlack className="text-4xl" />,
    "Trello": <SiTrello className="text-4xl" />,
    "Notion": <SiNotion className="text-4xl" />,
    "Postman": <SiPostman className="text-4xl" />,
    "Sentry": <SiSentry className="text-4xl" />,
    
    // Security & Testing
    "Linux": <SiLinux className="text-4xl" />,
    "Bitbucket": <SiBitbucket className="text-4xl" />,
    "Cypress": <SiCypress className="text-4xl" />,
    "Jest": <FaBug className="text-4xl" />,
    
    // Hosting & Deployment
    "Vercel": <SiVercel className="text-4xl" />,
    "Netlify": <SiNetlify className="text-4xl" />,
    
    // Miscellaneous
    "RabbitMQ": <SiRabbitmq className="text-4xl" />,
    "Kafka": <SiKakao className="text-4xl" />,
    "WordPress": <FaWordpress className="text-4xl" />,
    "Shopify": <FaShopify className="text-4xl" />,
  };
  
  export default skillIcons;
  
  