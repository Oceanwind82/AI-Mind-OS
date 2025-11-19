import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Tier Demo - AI Mind OS',
  description: 'Experience the free tier features and upgrade prompts of AI Mind OS',
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
