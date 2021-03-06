import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const prisma = new PrismaClient()

async function main() {
    const newLink = await prisma.link.create({
        data: {
            description: "Fullstack tutorial for GraphQl",
            url: "www.howthiswork.com"
        }
    })
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
