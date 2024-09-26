import { z } from "astro:content";
import slugify from "slugify";

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  featured: z.boolean(),
  date: z.string(),
  category: z.string(),
  status: z.string(),
  images: z.array(z.string()),
});

const api = {
  list: async () => {
    const document = await fetch(
      "https://docs.google.com/spreadsheets/d/1l92xWbStl1Fd4hHbPIxgTd4NK9kg4D64sqOuTNNwL5k/pub?gid=0&single=true&output=tsv"
    ).then((res) => res.text());
    const rows = document
      .split("\n")
      .slice(1)
      .map((row) => row.trim().split("\t"));

    return rows.map(([title, featured, date, category, status, images]) =>
      projectSchema.parse({
        id: slugify(title, { lower: true }),
        title,
        featured: featured === "TRUE",
        date,
        category,
        status,
        images: images.split(",").map((image) => image.trim()),
      })
    );
  },
};

export default api;
