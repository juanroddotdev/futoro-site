// Sample data for struggles and solutions

export interface Item {
  id: number;
  title: string;
  description: string;
}

export const struggles: Item[] = [
  {
    id: 1,
    title: 'Complex Requirements',
    description: 'Navigating intricate business needs and technical constraints.'
  },
  {
    id: 2,
    title: 'Technical Debt',
    description: 'Dealing with legacy code and architectural limitations.'
  },
  {
    id: 3,
    title: 'Tight Deadlines',
    description: 'Balancing quality and speed under pressure.'
  },
  {
    id: 4,
    title: 'Resource Constraints',
    description: 'Accomplishing more with limited team capacity.'
  },
  {
    id: 5,
    title: 'Changing Priorities',
    description: 'Adapting to shifting business goals and market demands.'
  }
];

export const solutions: Item[] = [
  {
    id: 1,
    title: 'Strategic Planning',
    description: 'Comprehensive roadmaps aligned with business objectives.'
  },
  {
    id: 2,
    title: 'Agile Methodology',
    description: 'Flexible, iterative approach to development and delivery.'
  },
  {
    id: 3,
    title: 'Technical Excellence',
    description: 'Clean architecture and sustainable coding practices.'
  },
  {
    id: 4,
    title: 'Effective Communication',
    description: 'Clear, consistent dialogue between all stakeholders.'
  },
  {
    id: 5,
    title: 'Continuous Improvement',
    description: 'Regular refinement of processes and practices.'
  }
];