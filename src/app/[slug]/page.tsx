import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';
import ProductImages from "@/components/ProductImages";
import CustomizeProducts from "@/components/CustomizeProducts";
import Add from "@/components/Add";

interface ProductPrice {
  price: number;
  discountedPrice?: number;
}

interface ProductMedia {
  mainMedia: {
    image: {
      url: string;
    };
  };
  items: {
    image: {
      url: string;
    };
  }[];
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: ProductPrice;
  media: ProductMedia;
  additionalInfoSections: { title: string, description: string }[];
  variants?: any;
  productOptions?: any;
  stock?: { quantity: number };
}

interface Section {
  title: string;
  description: string;
}


// Your dynamic page for a specific product
const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  // Read the JSON file (adjust the path to your file location)
  const filePath = path.join(process.cwd(), 'public/productsJson.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8'); // Synchronously read the JSON data

  // Parse the JSON data
  const productsData = JSON.parse(jsonData);
  
  // Find the product based on the slug
  const product = productsData.items.find((p: Product) => p.slug === slug);

  // If the product is not found, return a 404 page
  if (!product) {
    notFound();
    return null; // Return null after `notFound()` to avoid further rendering
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* Product Images */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.media.items} />
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        
        {/* Price */}
        {product.price.discountedPrice && product.price.discountedPrice < product.price.price ? (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">R{product.price.price}</h3>
            <h2 className="font-medium text-2xl">R{product.price.discountedPrice}</h2>
          </div>
        ) : (
          <h2 className="font-medium text-2xl">R{product.price.price}</h2>
        )}
        
        <div className="h-[2px] bg-gray-100" />
        
        {/* Add/Customize Buttons */}
        {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )}
        
        <div className="h-[2px] bg-gray-100" />
        
        {/* Additional Info */}
        {product.additionalInfoSections.map((section: Section) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
        
        <div className="h-[2px] bg-gray-100" />
        
        {/* User Reviews (Optional) */}
        <h1 className="text-2xl">User Reviews</h1>
      </div>
    </div>
  );
};

export default SinglePage;
export const generateStaticParams = async () => {
  const filePath = path.join(process.cwd(), 'public/productsJson.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8'); // Read the file synchronously
  const productsData = JSON.parse(jsonData);

  const paths = productsData.items.map((product: { slug: string }) => ({
    slug: product.slug, // Each path will have a slug parameter
  }));

  return paths;
};



