import { getDataSource } from "./db";
import { Post } from "./entities/Post";
import { Category } from "./entities/Category";

export async function seedIfEmpty(): Promise<void> {
  const ds = await getDataSource();
  const categoryRepo = ds.getRepository(Category);
  const postRepo = ds.getRepository(Post);

  const categoryCount = await categoryRepo.count();
  if (categoryCount > 0) return;

  const tech = categoryRepo.create({
    name: "Technology",
    slug: "technology"
  });
  const lifestyle = categoryRepo.create({
    name: "Lifestyle",
    slug: "lifestyle"
  });
  await categoryRepo.save([tech, lifestyle]);

  const posts = [
    postRepo.create({
      title: "Getting Started with Next.js 14",
      slug: "getting-started-with-nextjs-14",
      content: `# Getting Started with Next.js 14\n\nNext.js 14 brings exciting new features to the React ecosystem. With the App Router now stable, developers can take advantage of React Server Components, streaming, and more.\n\n## App Router\n\nThe App Router is the recommended way to build applications in Next.js 14. It uses the \`src/app\` directory and supports layouts, nested routing, and more.\n\n## Server Components\n\nReact Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client. This improves performance and user experience.\n\n## Getting Started\n\nTo create a new Next.js 14 project, run:\n\n\`\`\`bash\nnpx create-next-app@latest my-app\n\`\`\`\n\nFollow the prompts to set up your project with TypeScript, Tailwind CSS, and the App Router.\n\n## Conclusion\n\nNext.js 14 is a powerful framework for building modern web applications. Whether you're building a blog, an e-commerce site, or a complex web app, Next.js has you covered.`,
      excerpt:
        "Explore the new features in Next.js 14, including the stable App Router and React Server Components.",
      published: true,
      category: tech
    }),
    postRepo.create({
      title: "TypeORM with SQLite: A Practical Guide",
      slug: "typeorm-with-sqlite-practical-guide",
      content: `# TypeORM with SQLite: A Practical Guide\n\nTypeORM is a powerful ORM for TypeScript and JavaScript. Combined with SQLite, it provides a lightweight yet capable database solution for many applications.\n\n## Setting Up TypeORM\n\nFirst, install the required packages:\n\n\`\`\`bash\nnpm install typeorm better-sqlite3 reflect-metadata\n\`\`\`\n\n## Defining Entities\n\nEntities are TypeScript classes that map to database tables. Here's a simple example:\n\n\`\`\`typescript\n@Entity()\nexport class User {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column()\n  name: string;\n}\n\`\`\`\n\n## Querying Data\n\nTypeORM provides a rich API for querying data, including the QueryBuilder and Repository pattern.\n\n## Conclusion\n\nTypeORM with SQLite is an excellent choice for applications that need a simple, embedded database without the complexity of a full database server.`,
      excerpt:
        "Learn how to use TypeORM with SQLite for a lightweight database solution in your TypeScript applications.",
      published: true,
      category: tech
    }),
    postRepo.create({
      title: "The Art of Mindful Living",
      slug: "art-of-mindful-living",
      content: `# The Art of Mindful Living\n\nIn our fast-paced world, mindfulness has become more important than ever. Taking time to slow down and appreciate the present moment can transform your life.\n\n## What is Mindfulness?\n\nMindfulness is the practice of being fully present and engaged in the current moment. It involves paying attention to your thoughts, feelings, and surroundings without judgment.\n\n## Benefits of Mindfulness\n\n- Reduced stress and anxiety\n- Improved focus and concentration\n- Better emotional regulation\n- Enhanced overall well-being\n\n## Simple Mindfulness Practices\n\n### Morning Meditation\n\nStart your day with a 10-minute meditation session. Find a quiet spot, close your eyes, and focus on your breathing.\n\n### Mindful Eating\n\nPay attention to your food. Eat slowly, savor each bite, and avoid distractions like your phone or TV.\n\n### Evening Reflection\n\nBefore bed, take a few minutes to reflect on your day. What went well? What are you grateful for?\n\n## Conclusion\n\nMindful living is a journey, not a destination. Start small, be patient with yourself, and enjoy the process of becoming more present in your daily life.`,
      excerpt:
        "Discover the transformative power of mindfulness and learn practical techniques for incorporating it into your daily life.",
      published: true,
      category: lifestyle
    })
  ];

  await postRepo.save(posts);
}
