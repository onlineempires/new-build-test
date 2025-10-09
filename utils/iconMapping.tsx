import { 
  Lock, 
  Star, 
  Heart, 
  Gift, 
  Play, 
  Shield, 
  CheckCircle, 
  Award, 
  Zap, 
  Target, 
  Users, 
  Globe, 
  Crown, 
  Diamond, 
  Rocket,
  Mail
} from "lucide-react";

// Icon mapping for dynamic icon rendering
export const iconMap = {
  Lock,
  Star,
  Heart,
  Gift,
  Play,
  Shield,
  CheckCircle,
  Award,
  Zap,
  Target,
  Users,
  Globe,
  Crown,
  Diamond,
  Rocket,
  Mail,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ iconName, className = "", size }: IconProps) {
  const IconComponent = iconMap[iconName as IconName];
  
  if (!IconComponent) {
    // Fallback to Lock icon if the specified icon doesn't exist
    return <Lock className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}

// Helper function to get icon display name with emoji
export function getIconDisplayName(iconName: string): string {
  const displayNames: Record<string, string> = {
    Lock: "🔒 Lock",
    Star: "⭐ Star",
    Heart: "❤️ Heart",
    Gift: "🎁 Gift",
    Play: "▶️ Play",
    Shield: "🛡️ Shield",
    CheckCircle: "✅ CheckCircle",
    Award: "🏆 Award",
    Zap: "⚡ Zap",
    Target: "🎯 Target",
    Users: "👥 Users",
    Globe: "🌍 Globe",
    Crown: "👑 Crown",
    Diamond: "💎 Diamond",
    Rocket: "🚀 Rocket",
    Mail: "📧 Mail",
  };
  
  return displayNames[iconName] || "🔒 Lock";
}
