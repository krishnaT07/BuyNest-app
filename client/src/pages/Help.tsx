"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse shops, add items to your cart, and proceed to checkout. Enter your delivery address and payment details to complete your order."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards, UPI, and digital wallets. Cash on delivery may be available for select shops."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary by shop and location, typically ranging from 30 minutes to 2 hours."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel orders that are still pending or being prepared. Once an order is out for delivery, cancellation may not be possible."
    },
    {
      question: "How do I become a seller?",
      answer: "Click on 'Become a Seller' in the footer, fill out the registration form, and wait for approval from our admin team."
    },
    {
      question: "What if I receive a wrong item?",
      answer: "Contact the shop directly or reach out to our support team. We'll help resolve the issue and arrange for a replacement or refund."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Help & Support</h1>
          <p className="text-muted-foreground">We're here to help you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">support@buynest.com</p>
              <p className="text-sm text-muted-foreground mt-2">We typically respond within 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9 AM - 6 PM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Available 24/7</p>
              <p className="text-sm text-muted-foreground mt-2">Click the chat icon in the bottom right</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Help;

