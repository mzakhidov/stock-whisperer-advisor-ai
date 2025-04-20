
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type FAQ = {
  q: string;
  a: string;
};

interface FAQAccordionProps {
  faq: FAQ[];
}

export default function FAQAccordion({ faq }: FAQAccordionProps) {
  const [openItem, setOpenItem] = React.useState(faq.length > 0 ? faq[0].q : "");

  return (
    <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="w-full">
      {faq.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger
            className="flex justify-between items-center font-semibold text-finance-navy px-1 py-3 rounded-lg bg-white group transition"
          >
            <span>{item.q}</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white px-4 text-gray-700">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
