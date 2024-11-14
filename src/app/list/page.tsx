"use client";

import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ListPage = () => {
  const params = useSearchParams();
  const [categoryId, setCategoryId] = useState("default-category");

  useEffect(() => {
    const catParam = params?.get("cat") || "default-category";
    setCategoryId(catParam);
  }, [params]);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">{categoryId} For You!</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList categoryId={categoryId} searchParams={params} />
      </Suspense>
    </div>
  );
};

export default ListPage;

// "use client"
// import Filter from "@/components/Filter";
// import ProductList from "@/components/ProductList";
// import Skeleton from "@/components/Skeleton";
// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation"; // Assuming you are using `useSearchParams`
// import Image from "next/image";

// const ListPage = ({ searchParams }: { searchParams: any }) => {
//   // Get search parameters using useSearchParams hook
//   const params = useSearchParams();

//   // In case `searchParams` is used elsewhere in the component
//   const categoryId = searchParams.cat || params?.get('cat') || "default-category"; // Use category if available

//   return (
//     <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
//       {/* CAMPAIGN */}
//       <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
//         <div className="w-2/3 flex flex-col items-center justify-center gap-8">
//           <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
//             Grab up to 50% off on
//             <br /> Selected Products
//           </h1>
//           <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
//             Buy Now
//           </button>
//         </div>
//         <div className="relative w-1/3">
//           <Image src="/woman.png" alt="" fill className="object-contain" />
//         </div>
//       </div>

//       {/* FILTER */}
//       <Filter />

//       {/* PRODUCTS */}
//       <Suspense fallback={<Skeleton />}>
//         {/* <ProductList
//           categoryId={categoryId} // Pass the category ID from `searchParams` or the default value
//           searchParams={searchParams}
//         /> */}
//       </Suspense>
//     </div>
//   );
// };

// export default ListPage;

