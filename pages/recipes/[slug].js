import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";
import Image from "next/image"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: "recipe" });
  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });
  return {
    props: { recipe: items[0] },
  };
};

export default function RecipeDetails({ recipe }) {
  const { title, featuredImage, cookingTime, ingredients, method } =
    recipe.fields;
    console.log(recipe);
  return (
    <div>
      {/* Recipe Details for {recipe.fields.title} */}
      <div className="banner">
        <Image
          height={300}
          width={400}
          src={`https:${featuredImage.fields.file.url}`}
          alt={title}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Takes approx {cookingTime} mins to make</p>
        <h3>Ingredients:</h3>
        <ul>
          {ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
      <style jsx>{`
      h2,h3 {
        text-transform: uppercase;
      }
      .banner h2 {
        margin: 0;
        background: #fff;
        display: inline-block;
        padding: 20px;
        position: relative;
        top: -60px;
        left: -10px;
        box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
      }
      .info {
        margin: 20px 0;
      }
      .method {
        margin-top: 20px;
      }
      `}</style>
    </div>
  );
}
