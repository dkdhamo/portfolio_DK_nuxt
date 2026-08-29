import { config } from 'dotenv'

// `--local` seeds the SQLite file used by `npm run dev:local`; without it the
// seed targets whatever .env points at (production Turso).
config({ path: process.argv.includes('--local') ? '.env.local' : '.env' })

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { personalInfo, highlights, skills, experience, projects } from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const db = drizzle(client)

// Dates here match the resumes (Codingmart from May 2024). Keep the site,
// the CV, and LinkedIn saying the same thing — this is the first place a
// recruiter cross-checks.
async function seed() {
  console.log('Seeding database...')

  const info = {
    firstName: 'Dhamodhara',
    lastName: 'Kannan',
    title: 'Full Stack Engineer, .NET & Node, React & TypeScript',
    bio: 'Full-stack engineer with 2+ years building product software across .NET and Node on the back end and React with TypeScript on the front. I take features from requirements through schema and API design, UI, tests, and production support — and I have been building agentic AI tooling alongside the product work.',
    currentRole: 'Software Engineer at TransPerfect, Chennai',
    focus: 'Most useful on API-heavy products where the service and the interface are the same problem: ASP.NET Core and Node services, React front ends, and the testing and CI work that keeps them shippable.',
    city: 'Chennai, India',
    phone: '+91 9361490359',
    email: 'dhamodhara.kannan.a@gmail.com',
    // Self-hosted rather than the tiiny.site link the site used before, so the
    // CV button does not depend on a third-party host staying up.
    cvUrl: '/assets/resume/DK_resume_fullstack.pdf',
    profileImageUrl: '/img/blog/edited_pp.jpg',
    contactEmail: 'dhamodhara.kannan.a@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/dhamodharakannan',
    githubUrl: 'https://github.com/dkdhamo',
  }

  await db.insert(personalInfo).values({ id: 1, ...info })
    .onConflictDoUpdate({ target: personalInfo.id, set: info })

  // Impact metrics, not vanity counts.
  await db.delete(highlights)
  await db.insert(highlights).values([
    { value: '40% → 85%', label: 'Test coverage on a high-traffic enterprise product, via Jest and Playwright suites', sortOrder: 1 },
    { value: '850ms → <200ms', label: 'Search response time, using Elasticsearch with Redis caching', sortOrder: 2 },
    { value: '~40% faster', label: 'Initial page load, after profiling then code-splitting and lazy loading', sortOrder: 3 },
    { value: '30+ components', label: 'Shared Material UI design system adopted across three client applications', sortOrder: 4 },
  ])

  await db.delete(skills)
  await db.insert(skills).values([
    { name: 'C# / .NET', category: 'Backend', sortOrder: 1 },
    { name: 'ASP.NET Core', category: 'Backend', sortOrder: 2 },
    { name: 'Node.js', category: 'Backend', sortOrder: 3 },
    { name: 'Java / Spring Boot', category: 'Backend', sortOrder: 4 },
    { name: 'REST API design', category: 'Backend', sortOrder: 5 },
    { name: 'Spring Data JPA / Hibernate', category: 'Backend', sortOrder: 6 },
    { name: 'Entity Framework Core', category: 'Backend', sortOrder: 7 },

    { name: 'React', category: 'Frontend', sortOrder: 8 },
    { name: 'TypeScript', category: 'Frontend', sortOrder: 9 },
    { name: 'Next.js', category: 'Frontend', sortOrder: 10 },
    { name: 'Angular', category: 'Frontend', sortOrder: 11 },
    { name: 'Redux Toolkit', category: 'Frontend', sortOrder: 12 },
    { name: 'React Query', category: 'Frontend', sortOrder: 13 },
    { name: 'Material UI', category: 'Frontend', sortOrder: 14 },
    { name: 'Accessibility (a11y)', category: 'Frontend', sortOrder: 15 },

    { name: 'SQL Server (T-SQL)', category: 'Data', sortOrder: 16 },
    { name: 'MongoDB', category: 'Data', sortOrder: 17 },
    { name: 'Elasticsearch', category: 'Data', sortOrder: 18 },
    { name: 'Redis', category: 'Data', sortOrder: 19 },
    { name: 'Pinecone', category: 'Data', sortOrder: 20 },

    { name: 'Docker', category: 'Platform & Practices', sortOrder: 21 },
    { name: 'Azure DevOps CI/CD', category: 'Platform & Practices', sortOrder: 22 },
    { name: 'AWS (EC2, S3)', category: 'Platform & Practices', sortOrder: 23 },
    { name: 'Grafana', category: 'Platform & Practices', sortOrder: 24 },
    { name: 'TDD', category: 'Platform & Practices', sortOrder: 25 },
    { name: 'Jest / Playwright', category: 'Platform & Practices', sortOrder: 26 },
    { name: 'Agile / Scrum', category: 'Platform & Practices', sortOrder: 27 },

    { name: 'Model Context Protocol', category: 'AI Engineering', sortOrder: 28 },
    { name: 'Agentic AI / tool calling', category: 'AI Engineering', sortOrder: 29 },
    { name: 'RAG & embeddings', category: 'AI Engineering', sortOrder: 30 },
    { name: 'LLM APIs', category: 'AI Engineering', sortOrder: 31 },
  ])

  await db.delete(experience)
  await db.insert(experience).values([
    {
      year: 'May 2025 – Present',
      title: 'Software Engineer',
      company: 'TransPerfect, Chennai',
      description: 'Full-stack work on a high-traffic enterprise product: C# / ASP.NET Core and Node services with REST APIs over MongoDB, and React front ends consuming them. Practise test-first development, taking coverage from 40% to 85% with Jest and Playwright. Cut initial page load by roughly 40% through profiling, code-splitting, and lazy loading, and search from ~850ms to under 200ms with Elasticsearch and Redis caching. Built an internal MCP server that exposes Azure DevOps to AI developer tooling. Deploy through Azure DevOps CI/CD and take part in code review and architecture discussions.',
      type: 'work',
      sortOrder: 1,
    },
    {
      year: 'May 2024 – May 2025',
      title: 'Full Stack Engineer',
      company: 'Codingmart Technologies, Coimbatore',
      description: 'Migrated a legacy Java EE application (JSP, Servlets, JSTL, JDBC) to Spring Boot and React, owning both back end and front end. Rebuilt services on Spring Boot, Spring Security, and Spring Data JPA/Hibernate, exposing REST and JAX-RS endpoints, and tuned SQL Server queries, stored procedures, and triggers. Also delivered .NET/C# and MERN work, and built a 30+ component Material UI library shared across three client applications.',
      type: 'work',
      sortOrder: 2,
    },
    {
      year: 'May 2020 – May 2024',
      title: 'B.E. Computer Science and Engineering',
      company: 'Sri Krishna College of Technology, Coimbatore',
      description: '',
      type: 'education',
      sortOrder: 3,
    },
  ])

  await db.delete(projects)
  await db.insert(projects).values([
    {
      slug: 'azure-devops-mcp-server',
      title: 'Azure DevOps MCP Server',
      projectType: 'Developer Tooling',
      client: 'TransPerfect — internal developer platform',
      tools: 'TypeScript, Node.js, Model Context Protocol, Azure DevOps REST API, PowerShell',
      year: '2025',
      summary: 'An MCP server that exposes Azure DevOps as structured tools, so an LLM can carry out routine developer workflows through tool calling instead of a human clicking through the portal.',
      problem: 'A lot of day-to-day engineering time went into Azure DevOps chores — checking build and release state, moving work items, pulling pull request context, setting up environments. Each one is small, but they interrupt whatever you were actually doing, and the Azure DevOps UI makes you navigate several screens for answers that are one API call away.',
      approach: 'I built a Model Context Protocol server in TypeScript and Node.js that wraps the Azure DevOps REST API. Rather than exposing raw endpoints, each operation is published as a tool with an explicit schema — a clear name, typed arguments, and a description an LLM can reason about — so the model picks the right call and gets a validated payload back. Auth and scoping happen server-side, so the model never handles tokens, and destructive operations are deliberately kept out of the tool surface. PowerShell scripting handles the Windows-side environment setup steps that sit outside the REST API.',
      outcome: 'Now a daily-use internal tool — routine Azure DevOps work runs through the assistant rather than the portal, and adding a new automated workflow means defining one tool instead of writing a bespoke script. It also became the reference implementation for how we expose internal systems to agentic tooling.',
      previewUrl: '',
      repoUrl: '',
      thumbnailUrl: '/img/projects/cover-mcp-server.svg',
      images: JSON.stringify([]),
      sortOrder: 1,
      active: true,
    },
    {
      slug: 'rag-knowledge-assistant',
      title: 'AI-Powered Knowledge Assistant',
      projectType: 'AI / ML',
      client: 'Personal project',
      tools: 'React, TypeScript, Zustand, Pinecone, embeddings, semantic search, LLM APIs',
      year: '2025',
      summary: 'A retrieval-augmented chat assistant over 1,200+ technical documents, with streamed answers, source citations, and a relevance-feedback loop.',
      problem: 'A large body of technical documentation is only useful if you can find the one paragraph you need. Keyword search misses anything phrased differently, and asking a general model straight out produces confident answers that are not grounded in the actual documents.',
      approach: 'I built the ingestion side first: chunk the corpus, embed it, and index it in Pinecone so retrieval runs on semantic similarity rather than keyword overlap. The answer path retrieves the relevant chunks, grounds the model on them, and returns citations alongside the response so a reader can check the source. The front end is React and TypeScript with Zustand for state and streaming responses over SSE — which means treating loading, partial, error, and empty states as first-class, since a streamed answer can fail halfway through. A relevance-feedback loop captures which retrievals were actually useful, and the whole thing sits behind a REST API so it can be embedded in other applications.',
      outcome: 'Retrieval over the 1,200+ document corpus returns in under 400ms, and prompt engineering evaluated against a fixed question set cut hallucinated answers by roughly a third against the ungrounded baseline.',
      previewUrl: '',
      repoUrl: '',
      thumbnailUrl: '/img/projects/cover-rag-assistant.svg',
      images: JSON.stringify([]),
      sortOrder: 2,
      active: true,
    },
    {
      slug: 'java-ee-to-spring-boot-migration',
      title: 'Java EE to Spring Boot Migration',
      projectType: 'Platform',
      client: 'Codingmart Technologies — client application',
      tools: 'Spring Boot, Spring MVC, Spring Security, Spring Data JPA, Hibernate, React, TypeScript, SQL Server, Docker',
      year: '2024–2025',
      summary: 'Moved a legacy Java EE application off JSP, Servlets and raw JDBC onto Spring Boot with a React front end — incrementally, without a big-bang cutover.',
      problem: 'The application was built on JSP, Servlets, JSTL, and hand-written JDBC. Business logic lived in the view layer, every data access path repeated its own connection handling, and there was no clean seam to test against. It still had to keep serving users throughout, so a rewrite-and-swap was never an option.',
      approach: 'I rebuilt the back end on Spring Boot — Spring MVC for routing, Spring Security for authentication and authorisation, and Spring Data JPA with Hibernate to replace the hand-rolled JDBC — exposing REST and JAX-RS endpoints that the old and new front ends could both call. On the database side I reworked the SQL Server objects the application depended on, tuning queries and rewriting stored procedures and triggers around the new access patterns. The front end moved page by page: JSP views were replaced with React and TypeScript screens, with Bootstrap and jQuery kept alive at the boundary so half-migrated pages kept working during the cutover. Docker-based environments and CI/CD pipelines made each increment deployable on its own.',
      outcome: 'Interaction performance improved by about 28%, and the application came off Java EE with no big-bang release — onto a stack the team could actually test and extend.',
      previewUrl: '',
      repoUrl: '',
      thumbnailUrl: '/img/projects/cover-springboot-migration.svg',
      images: JSON.stringify([]),
      sortOrder: 3,
      active: true,
    },
    {
      slug: 'ar-vr-foundation-website',
      title: 'AR-VR Foundation Website',
      projectType: 'Website',
      client: 'La Fondation Dassault Systèmes',
      tools: 'React, JavaScript, responsive CSS',
      year: '2023',
      summary: 'A public site for a Dassault Systèmes education programme, presenting VR learning experiments to students and teachers.',
      problem: 'The programme needed a public home that could explain VR-based learning to a non-technical audience — students, teachers, and programme partners — and present a growing set of experiments without a redesign each time one was added.',
      approach: 'Built as a React single-page application with a component structure that treats each experiment as content rather than a bespoke page, so new ones drop into the existing gallery and detail patterns. Layout is responsive from phone through desktop, since a good share of the audience arrives on a school device.',
      outcome: 'Live and in use as the programme’s public face. Adding an experiment is a content change, not a front-end task.',
      previewUrl: 'https://la-fondation-dassault-systemes.vercel.app/',
      repoUrl: '',
      thumbnailUrl: '/img/Screenshot (667)-cropped.png',
      images: JSON.stringify(['/img/Screenshot (667)-cropped.png', '/img/Screenshot (668)-cropped.png']),
      sortOrder: 4,
      active: true,
    },
    {
      slug: 'multi-vendor-ecommerce',
      title: 'Multi-vendor E-commerce Platform',
      projectType: 'E-commerce',
      client: 'Ammu Collection LLC',
      tools: 'WooCommerce, WordPress, PHP, payment gateway integration',
      year: '2023',
      summary: 'A multi-vendor storefront where independent sellers manage their own catalogue, orders, and payouts.',
      problem: 'The client wanted to sell across multiple independent vendors rather than a single catalogue, which means per-vendor product management, order routing, and payout splitting — none of which a default store gives you.',
      approach: 'Built on WooCommerce with multi-vendor extensions, configured so each seller gets a scoped dashboard over their own products and orders. Set up the payment gateway, shipping rules, and order routing so a single customer basket resolves to the right vendor, and adapted the storefront theme for the catalogue and checkout flow.',
      outcome: 'Running in production as a live storefront with multiple sellers onboarded and managing their own listings.',
      previewUrl: 'https://desisinusa.net/',
      repoUrl: '',
      thumbnailUrl: '/img/Screenshot (671)-cropped.png',
      images: JSON.stringify(['/img/Screenshot (671)-cropped.png', '/img/Screenshot (699)-cropped.png']),
      sortOrder: 5,
      active: true,
    },
  ])

  console.log('Database seeded successfully.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
