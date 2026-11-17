import { CalendarDays, Download, Maximize2, MessageCircleQuestion, Monitor, Palette, Image as PhotoIcon, Ruler, Share2, Smartphone, Type, Wand2, Clock } from 'lucide-react';
import StepDiagram, { type DiagramStep } from './StepDiagram';

/** Section icons for the text under the wallpaper maker (one per heading). */
export const MakerIcons = {
  make: Wand2,
  size: Ruler,
  zones: Clock,
  set: Smartphone,
  desktop: Monitor,
  daily: CalendarDays,
  faq: MessageCircleQuestion,
};

const ic = 'h-6 w-6';
const iconProps = { className: ic, strokeWidth: 1.9, 'aria-hidden': true, focusable: false } as const;

// Labels are words from the how-to text beside each diagram ("...pick a style and the iPhone size, then save the image").
const MAKE: DiagramStep[] = [
  { label: 'Verse', icon: <Type {...iconProps} /> },
  { label: 'Style', icon: <Palette {...iconProps} /> },
  { label: 'Size', icon: <Maximize2 {...iconProps} /> },
  { label: 'Save', icon: <Download {...iconProps} /> },
];

// "On iPhone, save the image to Photos, open it, tap Share, then Use as Wallpaper."
const SET: DiagramStep[] = [
  { label: 'Photos', icon: <PhotoIcon {...iconProps} /> },
  { label: 'Share', icon: <Share2 {...iconProps} /> },
  { label: 'Use as Wallpaper', icon: <Smartphone {...iconProps} /> },
];

export function MakerMakeSteps() {
  return <StepDiagram steps={MAKE} />;
}

export function MakerSetSteps() {
  return <StepDiagram steps={SET} />;
}
