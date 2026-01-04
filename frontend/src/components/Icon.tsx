import { clsx } from "clsx";
import {
  ArrowRight,
  AudioWaveform,
  BadgeCheck,
  Bookmark,
  BookOpen,
  Bot,
  Brain,
  ChartBar,
  ChartLine,
  ChevronDown,
  CircleCheck,
  CircleQuestionMark,
  Clock,
  Gauge,
  Image,
  List,
  Mail,
  Menu,
  Mic,
  Moon,
  Palette,
  Rocket,
  Search,
  Share,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Upload,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const icons = {
  smart_toy: Bot,
  dark_mode: Moon,
  light_mode: Sun,
  menu: Menu,
  rocket_launch: Rocket,
  arrow_forward: ArrowRight,
  menu_book: BookOpen,
  bolt: Zap,
  bar_chart: ChartBar,
  psychology: Brain,
  speed: Gauge,
  graphic_eq: AudioWaveform,
  image: Image,
  upload_file: Upload,
  travel_explore: Search,
  construction: Wrench,
  star: Star,
  keyboard_arrow_down: ChevronDown,
  verified: BadgeCheck,
  auto_awesome: Sparkles,
  schedule: Clock,
  expand_more: ChevronDown,
  mail: Mail,
  share: Share,
  bookmark: Bookmark,
  list: List,
  check_circle: CircleCheck,
  tune: SlidersHorizontal,
  palette: Palette,
  analytics: ChartLine,
  mic: Mic
} as const;

type IconName = keyof typeof icons;

type IconProps = Omit<LucideProps, "ref"> & {
  name: IconName;
};

export default function Icon({
  name,
  className,
  size = "1em",
  "aria-label": ariaLabel,
  ...props
}: IconProps) {
  const LucideIcon = icons[name] ?? CircleQuestionMark;

  return (
    <LucideIcon
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={clsx("inline-block align-middle", className)}
      size={size}
      {...props}
    />
  );
}
