
import React, { useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Individual Investor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "AI Stock Whisperer has transformed my investment strategy. The AI-driven insights helped me make more informed decisions.",
  },
  {
    name: "Michael R.",
    role: "Day Trader",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "The technical analysis features of AI Stock Whisperer are incredibly accurate. It's like having a professional analyst by your side.",
  },
  {
    name: "Emily L.",
    role: "Portfolio Manager",
    image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "The sentiment analysis from AI Stock Whisperer helps me stay ahead of market trends. This tool has become essential for my daily trading.",
  },
];

export function CustomerTestimonials() {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-finance-navy">
          What Our Users Say About AI Stock Whisperer
        </h2>
        <div className="max-w-7xl mx-auto">
          <Carousel 
            setApi={setApi} 
            opts={{ 
              align: "start",
              loop: true,
              slidesToScroll: 3
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                  <Card className="border-none bg-transparent h-full">
                    <CardContent className="p-6 h-full flex flex-col justify-between">
                      <div className="flex flex-col h-full">
                        <Quote className="h-8 w-8 text-primary/60 mb-3" />
                        <p className="text-base md:text-lg text-gray-700 text-center italic mb-6 line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex-grow"></div>
                        {/* Bottom block: Avatar + Name/Role */}
                        <div className="flex flex-col items-center gap-2 mt-6">
                          <div className="relative rounded-full overflow-hidden h-20 w-20 shadow-lg mb-2">
                            <Avatar className="h-20 w-20">
                              <AvatarImage
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="object-cover h-full w-full"
                                style={{ objectPosition: 'center' }}
                              />
                              <div className="absolute inset-0 bg-black/30 z-20" />
                              <AvatarFallback className="z-30 absolute inset-0 flex items-center justify-center">
                                {testimonial.name.split(' ')[0][0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-lg text-finance-navy">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-600">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
