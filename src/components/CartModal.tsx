"use client";

import Image from "next/image";
// import { useCartStore } from "@/hooks/useCartStore";
import { useState, useEffect } from "react";


// Data types for cart
interface CartItem {
  _id: string;
  productName: { original: string };
  price: { amount: number };
  quantity: number;
  image: string;
  availability: { status: string };
}

interface Cart {
  lineItems: CartItem[];
  subtotal: { amount: number };
}

interface CheckoutResponse {
  checkoutId: string;
  redirectSession: { fullUrl: string };
}

interface Orders {
  items: CartItem[];
}


// Mocked response data to simulate the JSON object.
// const mockCart = {
//   lineItems: [
//     {
//       _id: "item1",
//       productName: { original: "Product 1" },
//       price: { amount: 2999.99 },
//       quantity: 2,
//       image: "https://firebasestorage.googleapis.com/v0/b/my-profile-95716.firebasestorage.app/o/custom-dunk-low-premium.png?alt=media&token=8f014243-2662-42b9-8efd-fc2eeeb5b60c",
//       availability: { status: "In Stock" },
//     },
//     {
//       _id: "item2",
//       productName: { original: "Product 2" },
//       price: { amount: 3999.99 },
//       quantity: 1,
//       image: "https://firebasestorage.googleapis.com/v0/b/my-profile-95716.firebasestorage.app/o/nike-5.jpg?alt=media&token=ecbfc076-9d28-47df-8a97-a927db874b9a",
//       availability: { status: "Out of Stock" },
//     },
//   ],
//   subtotal: { amount: 89.97 },
// };

// Placeholder for the mock checkout API response
const mockCheckoutResponse: CheckoutResponse = {
  checkoutId: "checkout123",
  redirectSession: {
    fullUrl: "https://example.com/checkout/redirect",
  },
};

const CartModal = () => {
  // const { cart, isLoading, removeItem } = useCartStore();

  // Initializing currentCart state with a valid Cart structure
  const [currentCart, setCurrentCart] = useState<Cart>({
    lineItems: [],
    subtotal: { amount: 0 },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products and update the cart state
  useEffect(() => {
    const getProductList = async () => {
      try {
        const products = await getOrders();
        // Calculate subtotal dynamically
        const subtotal = 0;
        // const subtotal = products.items.reduce(
        //   (total, item) => total + item.price.amount * item.quantity,
        //   0
        // );
        setCurrentCart({ lineItems: products.lineItems, subtotal: { amount: products.lineItems.reduce((total, item) => total + item.price.amount * item.quantity, 0) } });
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
  }, []);


  // Handle checkout by mocking the checkout API response
  const handleCheckout = async () => {
    // if (isLoading) return; // Prevent multiple clicks during loading state

    try {
      // Simulate API call for checkout creation
      const checkout = mockCheckoutResponse;

      // Mocked response for redirect session
      const redirectSession = checkout.redirectSession;

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl; // Redirect to the checkout URL
      }
    } catch (err) {
      console.error("Error during checkout process:", err);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    // Mock removal logic, just filter out the item from the current cart
    const updatedCart = currentCart.lineItems.filter((item) => item._id !== itemId);
    console.log("updated: ", updatedCart);
    setCurrentCart((prev) => ({
      ...prev,
      lineItems: updatedCart,
      subtotal: { amount: updatedCart.reduce((total, item) => total + item.price.amount * item.quantity, 0) },
    }));
  };

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!currentCart.lineItems || currentCart.lineItems.length === 0 ? (
        <div className="text-center">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          <div className="flex flex-col gap-8">
            {currentCart.lineItems.map((item) => (
              <div className="flex gap-4" key={item._id}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.productName?.original || "Product Image"}
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">{item.productName?.original}</h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        R{item.price?.amount}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{item.availability?.status}</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className="text-blue-500 cursor-pointer"
                      // style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>R{currentCart.subtotal?.amount || "N/A"}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">Shipping and taxes calculated at checkout.</p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View Cart
              </button>
              <button
                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                // disabled={isLoading}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Data-fetching function
const getOrders = async (): Promise<Cart> => {
  try {
    const response = await fetch("http://localhost:3100/getOrders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const products = await response.json();
    console.log("getOrders :", products);
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

export default CartModal;
