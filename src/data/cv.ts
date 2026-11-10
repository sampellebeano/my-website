import { matchesQuery } from "../lib/text-search.ts";

export type CVSection = "about" | "experience" | "work" | "qualifications" | "contact";

export interface CVEntry {
  id: string;
  section: CVSection;
  title: string;
  context: string;
  paragraphs: string[];
  keywords?: string;
  roleId?: string;
}

export const sections: { id: CVSection; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Career highlights" },
  { id: "qualifications", label: "Qualifications" },
  { id: "contact", label: "Contact" },
];

export const cvDownloads = {
  pdf: `${import.meta.env.BASE_URL}cv/Sam-Green-Solution-Architecture-CV.pdf`,
};

export const entries: CVEntry[] = [
  {
    id: "about",
    section: "about",
    title: "Sam Green",
    context: "Senior Solution Consultant | ServiceNow | UAE",
    paragraphs: [
      "I’m a Senior Solution Consultant at ServiceNow, based in the UAE. I help customers work out how they could use ServiceNow and build demos to show them. Before ServiceNow, I worked at Salesforce.",
      "At the moment, I work with aviation and wealth management customers, including projects around AI and automation. I also run Executive Briefing Centre sessions with customers in Ireland, the UK, UAE and Singapore.",
      "Before moving to the UAE, I worked with customers in Ireland. Before that, I specialised in IT Operations Management and Service Operations across EMEA.",
    ],
    keywords: "solution architect architecture presales pre sales Dubai United Arab Emirates",
  },
  {
    id: "servicenow-uae",
    section: "experience",
    title: "ServiceNow | Senior Solution Consultant, UAE",
    context: "March 2025 to present",
    paragraphs: [
      "I work with aviation and wealth management customers, working out how they could use ServiceNow and building demos to show it. Some of that work is around AI and automation for an airport and an international airline.",
      "I proposed one place for five separate business units to access services. I built the demo and worked out how IT, HR, Customer Experience, App Development and Asset Management would fit together. I also run Executive Briefing Centre sessions in Ireland, the UK, UAE and Singapore.",
    ],
    keywords: "AI architecture finance financial services EBC automation autonomous workforce",
  },
  {
    id: "servicenow-ireland",
    section: "experience",
    title: "ServiceNow | Senior Solution Consultant, Ireland",
    context: "May 2023 to March 2025",
    paragraphs: [
      "I worked with healthcare, retail and education customers in Ireland. I built ServiceNow demos for executives and senior teams, helped account teams assess opportunities and helped customers get more use from their applications.",
    ],
  },
  {
    id: "servicenow-itom",
    section: "experience",
    title: "ServiceNow | Advisory Digital Solution Consultant, ITOM",
    context: "November 2021 to May 2023",
    paragraphs: [
      "I was the first EMEA Digital Specialist Solution Consultant for IT Operations Management and Service Operations. I helped account teams with opportunities involving several products, ran technical training and hosted monthly ITOM webinars.",
    ],
  },
  {
    id: "salesforce",
    section: "experience",
    title: "Salesforce | Solution Engineer, UK & Ireland",
    context: "September 2018 to October 2021",
    paragraphs: [
      "I led solution engineering for small and medium businesses in professional services across the UK and Ireland. I also ran the Quip Black Belt programme, built a platform for weekly webinars and made training materials used by new sales colleagues across EMEA.",
    ],
  },
  {
    id: "enterprise-front-door",
    section: "work",
    roleId: "servicenow-uae",
    title: "One starting point for five business units",
    context: "ServiceNow | Proposal and demonstration",
    paragraphs: [
      "I proposed one place for people in five separate business units to access services. I built a demo and mapped out how IT, HR, Customer Experience, App Development and Asset Management would fit together.",
    ],
    keywords: "human resources information technology customer service application development assets transformation enterprise front door",
  },
  {
    id: "aviation",
    section: "work",
    roleId: "servicenow-uae",
    title: "AI and automation in aviation",
    context: "ServiceNow | Current work",
    paragraphs: [
      "I’m working on AI and automation ideas for an airport and an international airline. My part is working through what ServiceNow could do and building demos.",
    ],
    keywords: "AI artificial intelligence automation autonomous workforce",
  },
  {
    id: "executive-briefings",
    section: "work",
    roleId: "servicenow-uae",
    title: "Executive briefings",
    context: "ServiceNow | Ireland, UK, UAE and Singapore",
    paragraphs: [
      "I run Executive Briefing Centre sessions with customers in Ireland, the UK, UAE and Singapore. We talk through what they’re trying to do and where ServiceNow could help.",
    ],
    keywords: "EBC CxO stakeholder engagement",
  },
  {
    id: "quip",
    section: "work",
    roleId: "salesforce",
    title: "Quip Black Belt programme",
    context: "Salesforce | Training and webinars",
    paragraphs: [
      "I ran the Quip Black Belt programme and built a platform for weekly webinars. The training materials I made were used to onboard sales teams across EMEA.",
    ],
  },
  {
    id: "platform-certifications",
    section: "qualifications",
    title: "ServiceNow, ITIL and Salesforce certifications",
    context: "Platform certifications",
    paragraphs: [
      "ServiceNow Certified System Administrator (2021). ITIL Foundation Certificate in IT Service Management, AXELOS (2022).",
      "Salesforce certifications: Sales Cloud Consultant; Service Cloud Consultant; Pardot Specialist; Advanced Administrator; Platform App Builder; Administrator.",
    ],
    keywords: "CSA CRM certified",
  },
  {
    id: "ai-courses",
    section: "qualifications",
    title: "AI leadership and product innovation",
    context: "Stanford Online and Harvard Business School Online | 2025",
    paragraphs: [
      "Stanford Online: AI-Driven Leadership: Strategies for the Future; Mastering Generative AI for Product Innovation.",
      "Harvard Business School Online: AI Essentials for Business.",
    ],
    keywords: "artificial intelligence GenAI generative certificate courses",
  },
  {
    id: "business-courses",
    section: "qualifications",
    title: "Leadership, negotiation and entrepreneurship",
    context: "Professional development",
    paragraphs: [
      "Harvard Business School Online: Certificate in Negotiation Mastery (2023). Cambridge Judge Business School: Professional Service Firm Leader Program (2021).",
      "Saïd Business School, University of Oxford: Entrepreneurship: Venture Creation Programme, Distinction (2021). Youd Andrews: CxO Training (2024).",
    ],
  },
  {
    id: "sales-training",
    section: "qualifications",
    title: "Sales and demonstration training",
    context: "Sales training",
    paragraphs: ["SPIN Selling, Huthwaite International. ValueSelling Certification, Visualize. Storytelling Certified and Demo Certified, 2Win!"],
  },
  {
    id: "education",
    section: "qualifications",
    title: "Computer Science & Business",
    context: "Trinity College Dublin | II.1 Honours | 2014 to 2018",
    paragraphs: ["I studied Computer Science & Business at Trinity College Dublin, then went into solution engineering and consulting at Salesforce and ServiceNow."],
  },
  {
    id: "leadership",
    section: "about",
    title: "Culture Champions",
    context: "ServiceNow Ireland | 2024",
    paragraphs: [
      "In 2024, I chaired ServiceNow Ireland’s Culture Champions team. I led 12 colleagues and helped raise more than €15,000 for charity.",
    ],
  },
  {
    id: "contact",
    section: "contact",
    title: "Get in touch",
    context: "Based in the UAE",
    paragraphs: [
      "I’m based in the UAE. If you’d like to chat about work or something I’m building, email me at sam.jgreen@icloud.com or find me on LinkedIn.",
    ],
  },
];

export function searchEntries(query: string, section?: string): CVEntry[] {
  return entries.filter((entry) => {
    if (section && entry.section !== section) return false;
    return matchesQuery([entry.title, entry.context, ...entry.paragraphs, entry.keywords ?? ""].join(" "), query);
  });
}
