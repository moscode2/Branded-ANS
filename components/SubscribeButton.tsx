"use client";
import Link from "next/link";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SubscribeButton({ className, children }: Props) {
  return (
    <Link href="/subscribe" className={className ?? "btn-primary"}>
      {children ?? "Subscribe"}
    </Link>
  );
}