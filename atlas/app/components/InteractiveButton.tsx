// In app/components/InteractiveButton.tsx
"use client";

import { InteractiveHoverButton } from "app/components/magicui/interactive-hover-button";
import { useRouter } from "next/navigation";

interface InteractiveButtonProps {
  text: string;
  route: string;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({ text, route }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <InteractiveHoverButton
      containerClassName="w-auto h-auto"
      itemClassName="px-4 py-1.5 rounded-md text-sm font-medium bg-white text-[#7A96D5]"
      onClick={handleClick}
    >
      <span>{text}</span>
    </InteractiveHoverButton>
  );
};

export default InteractiveButton;