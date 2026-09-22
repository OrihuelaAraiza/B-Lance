import { MessageCircle, ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "../data/contact";

export function WhatsAppLink({
  className = "button button--ink",
  children = "Abrir chat en WhatsApp",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle aria-hidden="true" />
      {children}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}
