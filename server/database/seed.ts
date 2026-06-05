import 'dotenv/config'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { personalInfo, stats, skills, experience, projects } from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const db = drizzle(client)

async function seed() {
  console.log('Seeding database...')

  // Personal Info
  await db.insert(personalInfo).values({
    id: 1,
    firstName: 'Dhamodhara',
    lastName: 'Kannan',
    title: 'Software Engineer',
    bio: 'Experienced Software Engineer with 2+ years designing scalable applications utilizing React, TypeScript, and C#. I have built AI-powered systems including a RAG chatbot using NLP approaches. I manage the entire development process — design, implementation, deployment, and production support.',
    city: 'Chennai, India',
    phone: '+91 9361490359',
    email: 'dhamodhara.kannan.a@gmail.com',
    age: '24',
    nationality: 'India',
    language: 'English',
    freelanceAvailable: true,
    cvUrl: '/assets/resume/DK_resume_new_temp.pdf',
    profileImageUrl: '/img/blog/edited_pp.jpg',
    contactEmail: 'webtechians.dev@gmail.com',
    facebookUrl: 'https://www.facebook.com/dhamodhara.kannan.902/',
    twitterUrl: 'https://twitter.com/a_dhamodhara',
    linkedinUrl: 'https://www.linkedin.com/in/dhamodharakannan',
    dribbbleUrl: 'https://dribbble.com/DKDHAMO',
  }).onConflictDoUpdate({
    target: personalInfo.id,
    set: {
      firstName: 'Dhamodhara',
      bio: 'Experienced Software Engineer with 2+ years designing scalable applications utilizing React, TypeScript, and C#. I have built AI-powered systems including a RAG chatbot using NLP approaches.',
    },
  })

  // Stats
  await db.insert(stats).values({
    id: 1,
    yearsExperience: 2,
    completedProjects: 5,
    happyClients: 3,
    awardsWon: 3,
  }).onConflictDoUpdate({
    target: stats.id,
    set: { yearsExperience: 2 },
  })

  // Skills
  await db.delete(skills)
  await db.insert(skills).values([
    { name: 'React.js / TypeScript', percentage: 90, sortOrder: 1 },
    { name: 'Node.js / REST APIs', percentage: 85, sortOrder: 2 },
    { name: 'ASP.NET Core / C#', percentage: 82, sortOrder: 3 },
    { name: 'Databases (SQL + MongoDB)', percentage: 80, sortOrder: 4 },
    { name: 'AI & RAG / NLP', percentage: 75, sortOrder: 5 },
    { name: 'DevOps (Azure / Docker)', percentage: 72, sortOrder: 6 },
  ])

  // Experience
  await db.delete(experience)
  await db.insert(experience).values([
    {
      year: 'May 2025 – Present',
      title: 'Software Engineer',
      company: 'TransPerfect, Chennai',
      description: 'Developed scalable REST APIs with ASP.NET Core, Node.js and MongoDB. Built frontend features using React and TypeScript. Added Elasticsearch search, Redis caching, Kafka messaging, and Azure DevOps CI/CD pipelines.',
      type: 'work',
      sortOrder: 1,
    },
    {
      year: 'Jan 2024 – May 2025',
      title: 'Full Stack Engineer',
      company: 'Codingmart Technologies, Coimbatore',
      description: 'Created full-stack applications using React, TypeScript, ASP.NET Core, and RESTful APIs. Developed reusable UI components with Material UI, MS SQL Server schemas, and participated in Agile Scrum workflows.',
      type: 'work',
      sortOrder: 2,
    },
    {
      year: '2020 – 2024',
      title: 'B.E. Computer Science & Engineering',
      company: 'Sri Krishna College of Technology, Coimbatore',
      description: 'Bachelor of Computer Science and Engineering.',
      type: 'education',
      sortOrder: 3,
    },
  ])

  // Projects
  await db.delete(projects)
  await db.insert(projects).values([
    {
      title: 'RAG-Based AI Chatbot',
      projectType: 'AI / NLP',
      client: 'Personal Project',
      tools: 'Python, React, TypeScript, NLP, Elasticsearch',
      previewUrl: '',
      thumbnailUrl: '/img/Screenshot (667).png',
      images: JSON.stringify(['/img/Screenshot (667).png']),
      sortOrder: 1,
      active: true,
    },
    {
      title: 'AR-VR Foundation Website',
      projectType: 'Website',
      client: 'Dassault Systèmes',
      tools: 'React JS',
      previewUrl: 'https://la-fondation-dassault-systemes.vercel.app/',
      thumbnailUrl: '/img/Screenshot (667).png',
      images: JSON.stringify(['/img/Screenshot (667).png', '/img/Screenshot (668).png']),
      sortOrder: 2,
      active: true,
    },
    {
      title: 'Multi-vendor E-commerce',
      projectType: 'E-commerce',
      client: 'Ammu Collection LLC',
      tools: 'WooCommerce',
      previewUrl: 'https://desisinusa.net/',
      thumbnailUrl: '/img/Screenshot (671).png',
      images: JSON.stringify(['/img/Screenshot (671).png', '/img/Screenshot (699).png']),
      sortOrder: 3,
      active: true,
    },
    {
      title: 'College Website – SKCT',
      projectType: 'Website',
      client: 'Sri Krishna College of Technology',
      tools: 'HTML, CSS, JavaScript',
      previewUrl: 'https://dkteamcollegewebproto.netlify.app/',
      thumbnailUrl: '/img/Screenshot (669).png',
      images: JSON.stringify(['/img/Screenshot (669).png', '/img/Screenshot (700).png', '/img/Screenshot (701).png']),
      sortOrder: 4,
      active: true,
    },
  ])

  console.log('Database seeded successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
