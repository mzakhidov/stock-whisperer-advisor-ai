
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop",
    quote: "Stock Whisperer has transformed my investment strategy. The AI-driven insights helped me make more informed decisions.",
  },
  {
    name: "Michael R.",
    role: "Day Trader",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop",
    quote: "The technical analysis features are incredibly accurate. It's like having a professional analyst by your side.",
  },
  {
    name: "Emily L.",
    role: "Portfolio Manager",
    image: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=2940&auto=format&fit=crop",
    quote: "The sentiment analysis helps me stay ahead of market trends. This tool has become essential for my daily trading.",
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
          What Our Users Say
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
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4 h-full">
                        <Quote className="h-8 w-8 text-primary/60" />
                        <p className="text-base md:text-lg text-gray-700 text-center italic mb-6 line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                        <div className="mt-auto">
                          <Avatar className="h-16 w-16 mb-4">
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.split(' ')[0][0]}</AvatarFallback>
                          </Avatar>
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
