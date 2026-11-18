/**
 * Icon for a post list row, picked from the words of its bold label (then its text): a widget row gets the
 * widget icon, a notification row a bell, and so on. Icons only help scanning; they never carry meaning
 * the words don't (2026-11-18 blog design pass). First matching rule wins, so specific ideas come before
 * generic ones ("lock screen", "iPhone"). The same rule list is used on all three app sites.
 */
import {
  AlertTriangle, BatteryCharging, BellRing, Bell, BookOpen, Brain, Briefcase, Calendar, ChevronRight, Clock, Download,
  Focus, Gift, GraduationCap, HandHeart, Heart, Home, Image, LayoutGrid, Lightbulb, Lock, Moon, Palette, PenLine,
  Repeat, ScrollText, Search, Settings, Shield, Smartphone, Snowflake, Sunrise, Target, Type, Users, Zap,
  type LucideIcon,
} from 'lucide-react';

const RULES: [RegExp, LucideIcon][] = [
  [/\b(warning|avoid|don'?t|never|mistakes?|problems?|risks?|caution|downsides?|cons|drawbacks?|limits?)\b/, AlertTriangle],
  [/\b(tips?|tricks?|hacks?|ideas?)\b/, Lightbulb],
  [/\b(export|backups?|download|save|saving)\b/, Download],
  [/\b(speed|fast|faster|quick|quickly|instant|one tap)\b/, Zap],
  [/\bwidgets?\b/, LayoutGrid],
  [/\b(notifications?|banners?|alerts?)\b/, Bell],
  [/\breminders?\b/, BellRing],
  [/\b(wallpapers?|backgrounds?|photos?|images?|pictures?)\b/, Image],
  [/\b(sleep|night|bedtime|evening)\b/, Moon],
  [/\b(morning|sunrise|wake|dawn|fajr)\b/, Sunrise],
  [/\b(shortcuts?|automations?|automate|triggers?)\b/, Zap],
  [/\b(calendar|schedules?|dates?|weeks?|months?|planners?)\b/, Calendar],
  [/\b(times?|minutes?|seconds?|hours?|timers?|daily|every day)\b/, Clock],
  [/\b(bible|verses?|scripture|psalms?|gospel|kjv|niv|esv|nlt)\b/, BookOpen],
  [/\b(quran|qur'an|ayah|ayat|surah|dua|dhikr|hadith)\b/, ScrollText],
  [/\b(pray|prayers?|salah|salat|worship|devotion)/, HandHeart],
  [/\b(christmas|advent|gifts?|easter)\b/, Gift],
  [/\b(winter|snow)\b/, Snowflake],
  [/\b(goals?|habits?|targets?|streaks?|progress)\b/, Target],
  [/\b(study|studying|exams?|students?|class(es)?|college|school|homework|learn)/, GraduationCap],
  [/\b(adhd|brain|memory|attention|mind)\b/, Brain],
  [/\b(work|jobs?|meetings?|office|career)\b/, Briefcase],
  [/\b(family|kids|children|friends?|groups?|men|women|couples?)\b/, Users],
  [/\b(privacy|private|secure|security|safe)\b/, Shield],
  [/\b(personal|home|me time|weekend)\b/, Home],
  [/\b(focus|do not disturb|dnd|distraction)/, Focus],
  [/\b(fonts?|typography|text size)\b/, Type],
  [/\b(colou?rs?|styles?|themes?|design|palettes?)\b/, Palette],
  [/\b(notes?|write|writing|journal|lists?|to-?do)\b/, PenLine],
  [/\b(search|find)\b/, Search],
  [/\b(rotate|rotation|change|switch|refresh|repeat)\b/, Repeat],
  [/\b(love|marriage|heart|hope|peace|comfort)\b/, Heart],
  [/\b(lock ?screens?|locked|lock)\b/, Lock],
  [/\b(battery|power)\b/, BatteryCharging],
  [/\b(settings?|customi[sz]e|options?|toggles?)\b/, Settings],
  [/\b(iphone|phones?|ios|apps?)\b/, Smartphone],
];

export function pickIcon(label: string, text = ''): LucideIcon {
  const l = label.toLowerCase();
  for (const [re, icon] of RULES) if (re.test(l)) return icon;
  const t = text.toLowerCase().slice(0, 120);
  for (const [re, icon] of RULES) if (re.test(t)) return icon;
  return ChevronRight;
}

export interface LeadItem {
  label: string;
  text: string;
}

/** "**Label:** text", "**Label**: text", "**Label** — text" or "**Label.** text" → { label, text }; null otherwise. */
export function splitLead(item: string): LeadItem | null {
  const m = item.match(/^\*\*([^*]{2,80}?)\*\*\s*(?:[:—–]|-\s|\.\s)?\s*([\s\S]*)$/);
  if (!m) return null;
  // The label is rendered as markdown without its ** wrapper, so a leading "1. ", "- " or "# " would turn into a
  // list or heading (and, inside a <p>, a hydration mismatch). Escape it so it stays text.
  const label = m[1].trim().replace(/[:.]$/, '').trim().replace(/^(\d+)([.)])(\s)/, '$1\\$2$3').replace(/^([-*+#>])(\s)/, '\\$1$2');
  let text = m[2].trim();
  const sep = /[:.]$/.test(m[1].trim()) || /^\*\*[^*]+\*\*\s*[:—–.-]/.test(item);
  if (!sep && text) return null;
  if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
  return { label, text };
}

/** A list reads as rows when at least two items, and 60 % of them, start with a bold label. */
export function leadItems(items: string[]): (LeadItem | { label: ''; text: string })[] | null {
  if (items.length < 2) return null;
  const parsed = items.map((it) => splitLead(it));
  const hits = parsed.filter(Boolean).length;
  if (hits < 2 || hits / items.length < 0.6) return null;
  return parsed.map((p, i) => p ?? { label: '', text: items[i] });
}
