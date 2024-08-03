"use server";
import prisma from "@/lib/prisma";

async function getPosts() {
  const posts = await prisma.dexINFO.findMany();
  return posts;
}

export const Access = () => {
  const posts = getPosts();
  posts.then((data) => {
    console.log(data[1]);
  });

  return (
    <button>test</button>
  );            
};

export default Access;