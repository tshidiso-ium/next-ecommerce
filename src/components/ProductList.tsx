import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";
import Skeleton from "@/components/Skeleton";
import { useState, useEffect } from "react";

// Constants
const PRODUCT_PER_PAGE = 8;

// Interfaces for TypeScript
interface ProductPrice {
  price: number;
  discountedPrice?: number;
}

interface ProductMedia {
  mainMedia: { image: { url: string } };
  items: { image: { url: string } }[];
}

interface AdditionalInfoSection {
  title: string;
  description: string;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: ProductPrice;
  media: ProductMedia;
  additionalInfoSections: AdditionalInfoSection[];
  type?: string;
  productType?: string;
  variants?: any;
  productOptions?: any;
  stock?: { quantity: number };
}

interface ProductsJson {
  items: Product[];
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface Error {
  code: string;
  message: string;
  status: number;
  details?: string[];
  timestamp?: string;
  path?: string;
  requestId?: string;
}

// Component
const ProductList = async ({
  categoryId,
  limit = PRODUCT_PER_PAGE,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const [productsList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProductList = async () => {
      try {
        const products = await getProducts();
        setProductList(products.items);
        setLoading(false);
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
          console.error("Product fetching error: ", err.message);
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching products.");
        }
      }
    };

    getProductList();
  }, [categoryId, searchParams]);

        // Filter and paginate products
  let filteredProducts = productsList;

  if (searchParams?.name) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchParams.name.toLowerCase())
    );
  }

  if (searchParams?.type) {
    filteredProducts = filteredProducts.filter((product) =>
      product.productType === searchParams.type
    );
  }

  if (searchParams?.min || searchParams?.max) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price.price >= (searchParams?.min || 0) &&
        product.price.price <= (searchParams?.max || 999999)
    );
  }

  const startIndex = (searchParams?.page ? parseInt(searchParams.page) : 0) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  const hasPrev = startIndex > 0;
  const hasNext = startIndex + limit < filteredProducts.length;

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {paginatedProducts.map((product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt={product.name}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt={product.name}
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between flex-wrap">
            <span className="font-medium w-full">{product.name}</span>
            <span className="font-semibold">R{product.price?.price}</span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            />
          )}
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
      {(searchParams?.cat || searchParams?.name) && (
        <Pagination
          currentPage={1} // Update this to reflect the actual page number
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

// Data-fetching function
const getProducts = async () => {
  try {
    const response = await fetch("http://localhost:3100/getProducts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const products = await response.json();
    return products;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching products: ", err.message);
      throw new Error(`Failed to fetch products: ${err.message}`);
    } else {
      console.error("Unknown error occurred", err);
      throw new Error("An unknown error occurred while fetching products.");
    }
  }
};

export default ProductList;
