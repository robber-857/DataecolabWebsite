export const stages = [
  { name: 'Discover', title: 'Start with a clear view.', description: 'Identify the agents in your organisation. Establish their purpose, ownership and operating context before deciding what comes next.', question: 'What is here, and who is responsible?' },
  { name: 'Assess', title: 'Understand the context.', description: 'Examine an agent’s intended use, data dependencies and risks. Bring data, IT and AI governance into the conversation early.', question: 'What should we understand before proceeding?' },
  { name: 'Approve', title: 'Make accountability explicit.', description: 'Define the scope of authorisation, the accountable decision makers and the boundaries within which an agent may operate.', question: 'Who can authorise this agent, and on what terms?' },
  { name: 'Operate', title: 'Make oversight part of everyday practice.', description: 'Consider how an agent behaves within the enterprise. Make responsibilities and review points part of its operating practice.', question: 'Is the agent operating within its agreed boundaries?' },
  { name: 'Evolve', title: 'Treat change as a decision.', description: 'Revisit an agent’s context when its purpose, data or technology changes. Reassessment connects evolution with continued oversight.', question: 'What has changed, and what needs another review?' },
  { name: 'Retire', title: 'Close the lifecycle with care.', description: 'Plan the end of an agent’s use. Consider dependent activities, ongoing responsibilities and the records that need to remain.', question: 'What must be resolved before this agent is retired?' },
];

export const lenses = [
  { name: 'People', title: 'Accountability starts with people.', text: 'An enterprise ecosystem is a human system, too. Help decision makers, practitioners and governance teams develop a shared understanding of enterprise practice.', focus: 'Ownership · Responsibilities · Collaboration', image: 'architecture', position: '70% 50%' },
  { name: 'Data', title: 'Understand data in context.', text: 'Look beyond individual datasets. Explore how data is created, used and managed across activities, and what that means for the agents that depend on it.', focus: 'Context · Knowledge · Dependencies', image: 'glass', position: '78% 50%' },
  { name: 'Technology', title: 'See beyond individual systems.', text: 'Consider technologies as part of an evolving enterprise. Examine their roles alongside people and data when planning changes to the way your organisation works.', focus: 'Systems · Architecture · Change', image: 'porcelain', position: '85% 50%' },
];

export const articles = [
  {
    id: 'agentic-practice', category: 'Agent lifecycle management', title: 'From AI governance to agentic practice.',
    summary: 'Why governance needs to be embedded in day-to-day practice throughout the agent lifecycle.',
    paragraphs: [
      'A governance framework sets direction. Enterprise agentic practice asks how that direction becomes part of day-to-day decisions about agents.',
      'DataEco Lab’s services describe Agent Lifecycle Management as a way to bring data, IT and AI governance into earlier engagement with agent development and subsequent change.',
      'Questions for the enterprise include who owns an agent, where its authority begins and ends, and when a change should trigger reassessment. The lifecycle presented here is an editorial introduction to those questions.',
    ], source: 'https://www.dataecolab.com/services', image: '/images/original-platform-4.png', imageCaption: 'Original ALM concept illustration',
  },
  {
    id: 'enterprise-ecosystem', category: 'Ecosystem methodology', title: 'The enterprise is a living ecosystem.',
    summary: 'A people, data and technology perspective on complexity and continuous change.',
    paragraphs: [
      'An enterprise data ecosystem encompasses people, data, systems and the activities through which they work together. Looking at one element alone can obscure its wider context.',
      'DataEco Lab’s ecosystem-based approach considers enterprise data practice as an evolving operational system. It uses modelling to support a shared understanding across disciplines.',
      'For a research or enterprise conversation, the starting point is a practical question: what changes when we examine the organisation as a whole? This perspective provides context for discussing ownership, dependencies and the consequences of change.',
    ], source: 'https://www.dataecolab.com/', image: '/images/enterprise-ecosystem.webp', imageCaption: 'People, data and technology — a shared enterprise environment',
  },
];
