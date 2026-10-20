type Chapter = { title: string; text: string; href?: string; link?: string };
type PageContent = { image: string; lead: string; status?: string; chapters: Chapter[] };

export const pageContent: Record<string, PageContent> = {
  '/vision': {
    image: 'architecture', lead: 'Intelligent enterprise starts with a connected view of agents, people, data and technology.',
    chapters: [
      { title: 'Enterprise Agent Lifecycle Management', text: 'Developing approaches for the responsible management of agents throughout their lifecycle, with an understanding of their enterprise context.', href: '/toolsplatforms', link: 'Explore ALMOps' },
      { title: 'An ecosystem perspective', text: 'Helping organisations understand and manage enterprise data practice as an evolving ecosystem, with capability and confidence.', href: '/#ecosystem', link: 'Explore the ecosystem perspective' },
      { title: 'From research to practice', text: 'Connecting methodological thinking with the practical questions facing enterprise teams.', href: '/services', link: 'Discover our services' },
    ],
  },
  '/services': {
    image: 'porcelain', lead: 'Consulting and training informed by Agent Lifecycle Management and an ecosystem-based approach.',
    chapters: [
      { title: 'Agent lifecycle & governance practice', text: 'Examine how data, IT and AI governance engage with agent development, authorisation and change. Discuss the organisational practice surrounding your agents.', href: '/#almops', link: 'Explore the lifecycle' },
      { title: 'Enterprise ecosystem management', text: 'Use modelling to understand enterprise data practice, its complexity and the relationships between people, data and technology.' },
      { title: 'Assessment & transformation planning', text: 'Examine maturity, context and the implications of change to inform enterprise planning and transformation decisions.' },
      { title: 'Architecture & knowledge management', text: 'Consider consolidated data architecture and the knowledge needed to understand and manage the enterprise ecosystem.' },
      { title: 'Training & shared understanding', text: 'Discuss your team’s learning needs and the questions you want to explore across disciplines.', href: '/working-with-us/workshops-forums', link: 'Workshops & forums' },
    ],
  },
  '/toolsplatforms': {
    image: 'glass', lead: 'Tools grounded in methods for understanding and managing the enterprise.', status: 'Emerging technologies · In development',
    chapters: [
      { title: 'ALMOps', text: 'Agent Lifecycle Management Operating System: a methodology-based platform being developed to support enterprise agentic practice and the management of agent fleets across an enterprise ecosystem.', href: '/#almops', link: 'Explore the lifecycle approach' },
      { title: 'DPMOps / EDE-360', text: 'Data Practice Management Operating System: an interrelated suite of tools addressing enterprise data practice, architecture, knowledge management and change. EDE-360 provides an ecosystem perspective.', href: '/#ecosystem', link: 'Explore the ecosystem approach' },
      { title: 'Discuss the scope with our team', text: 'For current development scope, availability and suitability for your organisation, please contact us.', href: '/contact-us', link: 'Talk to our team' },
    ],
  },
  '/resources': {
    image: 'glass', lead: 'A place for the ideas and methods behind our enterprise perspective.', status: 'Resource Centre · Under construction',
    chapters: [
      { title: 'Research & perspectives', text: 'Read the editorial introductions to agentic practice and enterprise ecosystems on our homepage.', href: '/#research', link: 'Read our perspectives' },
      { title: 'Research perspectives', text: 'Explore the thinking behind our lifecycle and ecosystem approach. Supporting illustrations can be expanded in the homepage research details.', href: '/#research', link: 'Explore the research perspectives' },
      { title: 'Looking for a specific resource?', text: 'Contact the team with your topic or research question. The wider resource collection is still being prepared.', href: '/contact-us', link: 'Ask our team' },
    ],
  },
  '/working-with-us': {
    image: 'architecture', lead: 'Explore a conversation around research, enterprise practice or shared learning.', status: 'Collaboration programme details · Coming soon',
    chapters: [
      { title: 'Joining R&D Project', text: 'Discuss research interests and enquire about opportunities to work together.', href: '/working-with-us/joining-rd-project', link: 'Explore research collaboration' },
      { title: 'Partners & Clients', text: 'Bring an enterprise challenge or a partnership enquiry to our team.', href: '/working-with-us/partners-clients', link: 'Partnerships & enterprise enquiries' },
      { title: 'Workshops & Forums', text: 'Start a conversation about learning and discussion around enterprise ecosystems and agents.', href: '/working-with-us/workshops-forums', link: 'Explore workshops & forums' },
    ],
  },
  '/about-us': {
    image: 'architecture', lead: 'DataEco Lab is an Australian research and development company focused on enterprise Agent Lifecycle Management and enterprise ecosystems.',
    chapters: [
      { title: 'Our perspective', text: 'We consider people, data and technology together. Our work connects research-led approaches with questions arising in enterprise practice.', href: '/vision', link: 'Read our vision' },
      { title: 'Meet the management team', text: 'For an introduction to the management team, contact DataEco Lab directly.', href: '/contact-us', link: 'Get in touch' },
      { title: 'DataEco Lab Pty Ltd', text: 'Based at 8 Hadenfeld Ave, Macquarie University NSW 2109, Australia.', href: 'mailto:info@dataecolab.com', link: 'info@dataecolab.com' },
    ],
  },
  '/working-with-us/joining-rd-project': {
    image: 'glass', lead: 'Share your research interests and the enterprise questions you would like to explore.', status: 'Project information · Under construction',
    chapters: [
      { title: 'An enquiry starts the conversation', text: 'Tell us about your research area, organisation and interest in Agent Lifecycle Management or enterprise ecosystems.', href: 'mailto:info@dataecolab.com?subject=Research%20collaboration', link: 'Enquire about R&D collaboration' },
      { title: 'Project details', text: 'Project descriptions, participation arrangements and application dates have not been published on this page. Please contact the team for current information.' },
    ],
  },
  '/working-with-us/partners-clients': {
    image: 'porcelain', lead: 'Bring your enterprise context to a conversation with DataEco Lab.', status: 'Partners & Clients · Under construction',
    chapters: [
      { title: 'Enterprise & partnership enquiries', text: 'Let us know what you are exploring, the challenges you face and how you would like to work together.', href: 'mailto:info@dataecolab.com?subject=Enterprise%20and%20partnership%20enquiry', link: 'Start a conversation' },
      { title: 'Explore our approach', text: 'Learn about the consulting and training areas that inform our enterprise work.', href: '/services', link: 'Explore services' },
    ],
  },
  '/working-with-us/workshops-forums': {
    image: 'architecture', lead: 'Explore shared learning around agents, people, data and technology.', status: 'Workshops & Forums · Under construction',
    chapters: [
      { title: 'Discuss your learning needs', text: 'Share your proposed topic, audience and questions with our team.', href: 'mailto:info@dataecolab.com?subject=Workshop%20or%20forum%20enquiry', link: 'Enquire about workshops & forums' },
      { title: 'Programme information', text: 'Dates, speakers, venues and registration details have not been published on this page. Contact us for current information.' },
    ],
  },
  '/contact-us': {
    image: 'architecture', lead: 'For enterprise enquiries, research collaboration or a conversation with the team.',
    chapters: [
      { title: 'Email our team', text: 'Tell us about your organisation and what you would like to explore.', href: 'mailto:info@dataecolab.com', link: 'info@dataecolab.com' },
      { title: 'Find us', text: '8 Hadenfeld Ave, Macquarie University NSW 2109, Australia.' },
      { title: 'Company information', text: 'DataEco Lab Pty Ltd.', href: '/about-us', link: 'About DataEco Lab' },
    ],
  },
};
