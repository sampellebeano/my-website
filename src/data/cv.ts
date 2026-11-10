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
      "I’m a Senior Solution Consultant at ServiceNow in the UAE. I work with enterprise customers on solution architecture and demonstrations, drawing on eight years at ServiceNow and Salesforce.",
      "My current work covers aviation and wealth management, including autonomous workforce use cases. I also lead Executive Briefing Centre sessions across Ireland, the UK, UAE and Singapore.",
      "Before moving to the UAE, I supported customers in Ireland and specialised in IT Operations Management and Service Operations across EMEA.",
    ],
    keywords: "solution architect architecture presales pre sales Dubai United Arab Emirates",
  },
  {
    id: "servicenow-uae",
    section: "experience",
    title: "ServiceNow | Senior Solution Consultant, UAE",
    context: "March 2025 to present",
    paragraphs: [
      "I work with aviation and wealth management customers on ServiceNow use cases and demonstrations. That includes autonomous workforce initiatives for an airport planned to become the world’s largest by passenger capacity and one of the world’s largest international airlines.",
      "I proposed and demonstrated a single enterprise front door spanning five independent business units, and structured the architecture across IT, HR, Customer Experience, App Development and Asset Management. I also lead Executive Briefing Centre sessions across Ireland, the UK, UAE and Singapore.",
    ],
    keywords: "AI architecture finance financial services EBC automation",
  },
  {
    id: "servicenow-ireland",
    section: "experience",
    title: "ServiceNow | Senior Solution Consultant, Ireland",
    context: "May 2023 to March 2025",
    paragraphs: [
      "I worked with enterprise healthcare, retail and education customers in Ireland. I built ServiceNow demonstrations for executive and senior stakeholders, qualified opportunities with account teams and helped customers improve application adoption.",
    ],
  },
  {
    id: "servicenow-itom",
    section: "experience",
    title: "ServiceNow | Advisory Digital Solution Consultant, ITOM",
    context: "November 2021 to May 2023",
    paragraphs: [
      "I was the first EMEA Digital Specialist Solution Consultant for IT Operations Management and Service Operations. I supported multi-product opportunities and customer adoption through technical enablement and monthly ITOM webinars.",
    ],
  },
  {
    id: "salesforce",
    section: "experience",
    title: "Salesforce | Solution Engineer, UK & Ireland",
    context: "September 2018 to October 2021",
    paragraphs: [
      "I led UK & Ireland SMB solution engineering for professional services and the Quip Black Belt programme. I built an integrated platform for weekly webinars and created enablement materials used in EMEA sales onboarding.",
    ],
  },
  {
    id: "enterprise-front-door",
    section: "work",
    roleId: "servicenow-uae",
    title: "A single enterprise front door",
    context: "ServiceNow | Proposal and demonstration",
    paragraphs: [
      "Five independent business units, one proposed enterprise front door. I demonstrated the concept and structured its architecture across IT, HR, Customer Experience, App Development and Asset Management.",
    ],
    keywords: "human resources information technology customer service application development assets transformation",
  },
  {
    id: "aviation",
    section: "work",
    roleId: "servicenow-uae",
    title: "Autonomous workforce solutions for aviation",
    context: "ServiceNow | Current initiatives",
    paragraphs: [
      "I’m developing autonomous workforce use cases for an airport planned to become the world’s largest by passenger capacity and one of the world’s largest international airlines. My work centres on ServiceNow use cases and demonstrations.",
    ],
    keywords: "AI artificial intelligence automation",
  },
  {
    id: "executive-briefings",
    section: "work",
    roleId: "servicenow-uae",
    title: "Global enterprise executive briefings",
    context: "ServiceNow | Ireland, UK, UAE and Singapore",
    paragraphs: [
      "I lead enterprise Executive Briefing Centre sessions across Ireland, the UK, UAE and Singapore, working through customer priorities and where ServiceNow fits.",
    ],
    keywords: "EBC CxO stakeholder engagement",
  },
  {
    id: "quip",
    section: "work",
    roleId: "salesforce",
    title: "Quip Black Belt programme",
    context: "Salesforce | Programme leadership and enablement",
    paragraphs: [
      "I led the Quip Black Belt programme and built an integrated platform for weekly webinars. The enablement materials I created were used in EMEA sales onboarding.",
    ],
  },
  {
    id: "platform-certifications",
    section: "qualifications",
    title: "ServiceNow, ITIL and Salesforce credentials",
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
    context: "Enterprise customer engagement",
    paragraphs: ["SPIN Selling, Huthwaite International. ValueSelling Certification, Visualize. Storytelling Certified and Demo Certified, 2Win!"],
  },
  {
    id: "education",
    section: "qualifications",
    title: "Computer Science & Business",
    context: "Trinity College Dublin | II.1 Honours | 2014 to 2018",
    paragraphs: ["A combined background in computer science and business, followed by solution engineering and consulting roles at Salesforce and ServiceNow."],
  },
  {
    id: "leadership",
    section: "about",
    title: "Culture Champions leadership",
    context: "ServiceNow Ireland | 2024",
    paragraphs: [
      "In 2024, I chaired ServiceNow Ireland’s Culture Champions team. I led 12 colleagues and helped raise more than €15,000 for charity.",
    ],
  },
  {
    id: "contact",
    section: "contact",
    title: "Connect with Sam",
    context: "Based in the UAE",
    paragraphs: [
      "I’m based in the UAE. For work or a conversation about something I’m building, email sam.jgreen@icloud.com or connect with me on LinkedIn.",
    ],
  },
];

export function searchEntries(query: string, section?: string): CVEntry[] {
  return entries.filter((entry) => {
    if (section && entry.section !== section) return false;
    return matchesQuery([entry.title, entry.context, ...entry.paragraphs, entry.keywords ?? ""].join(" "), query);
  });
}
