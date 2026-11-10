export type CVSection = "about" | "experience" | "work" | "qualifications" | "contact";

export interface CVEntry {
  id: string;
  section: CVSection;
  title: string;
  context: string;
  paragraphs: string[];
  roleId?: string;
}

export const sections: { id: CVSection; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Career highlights" },
  { id: "qualifications", label: "Courses & credentials" },
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

export const qualificationGroups = [
  {
    id: "platform-certifications",
    title: "Platform certifications",
    credentials: [
      { title: "ServiceNow Certified System Administrator", context: "2021" },
      { title: "ITIL Foundation Certificate in IT Service Management", context: "AXELOS · 2022" },
      { title: "Sales Cloud Consultant", context: "Salesforce" },
      { title: "Service Cloud Consultant", context: "Salesforce" },
      { title: "Pardot Specialist", context: "Salesforce" },
      { title: "Advanced Administrator", context: "Salesforce" },
      { title: "Platform App Builder", context: "Salesforce" },
      { title: "Administrator", context: "Salesforce" },
    ],
  },
  {
    id: "ai-courses",
    title: "AI leadership and product innovation",
    credentials: [
      { title: "AI-Driven Leadership: Strategies for the Future", context: "Stanford Online · 2025" },
      { title: "Mastering Generative AI for Product Innovation", context: "Stanford Online · 2025" },
      { title: "AI Essentials for Business", context: "Harvard Business School Online · 2025" },
    ],
  },
  {
    id: "business-courses",
    title: "Leadership, negotiation and entrepreneurship",
    credentials: [
      { title: "Certificate in Negotiation Mastery", context: "Harvard Business School Online · 2023" },
      { title: "Professional Service Firm Leader Program", context: "Cambridge Judge Business School · 2021" },
      { title: "Entrepreneurship: Venture Creation Programme", context: "Saïd Business School, University of Oxford · Distinction · 2021" },
      { title: "CxO Training", context: "Youd Andrews · 2024" },
    ],
  },
  {
    id: "sales-training",
    title: "Sales and demonstration training",
    credentials: [
      { title: "SPIN Selling", context: "Huthwaite International" },
      { title: "ValueSelling Certification", context: "Visualize" },
      { title: "Storytelling Certified", context: "2Win!" },
      { title: "Demo Certified", context: "2Win!" },
    ],
  },
  {
    id: "education",
    title: "Education",
    credentials: [
      { title: "Computer Science & Business", context: "Trinity College Dublin · II.1 Honours · 2014 to 2018" },
    ],
  },
];
