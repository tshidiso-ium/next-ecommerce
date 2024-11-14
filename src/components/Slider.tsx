"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the type for a slide object
interface Slide {
  id: number;
  title: string;
  description: string;
  img: string;
  url: string;
  bg: string;
}

const Slider = () => {
  const [slideData, setSlideData] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSliderList = async () => {
      try {
        const fetchedSlides = await getSlider();
        setSlideData(fetchedSlides);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Slider fetching error: ", err.message);
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching slider.");
        }
      } finally {
        setLoading(false);
      }
    };

    getSliderList();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [slideData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!slideData.length) return <div>No slides available.</div>;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slideData.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                {slide.description}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-4 ">
                  SHOP NOW
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {slideData.map((_, index) => (
          <div
            className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
              current === index ? "scale-150" : ""
            }`}
            key={index}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Data-fetching function
const getSlider = async (): Promise<Slide[]> => {
  try {
    const response = await fetch("http://localhost:3100/getSlider", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch slides");
    const slides: Slide[] = await response.json();
    return slides;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching slides: ", err.message);
      throw new Error(`Failed to fetch slides: ${err.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching slides.");
    }
  }
};

export default Slider;
