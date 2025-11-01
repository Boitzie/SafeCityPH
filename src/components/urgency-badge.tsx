import { Badge } from "@/components/ui/badge"
import type { ReportUrgency } from "@/lib/types"
import { Flame, AlertTriangle, ShieldCheck } from "lucide-react"

type UrgencyBadgeProps = {
  urgency: ReportUrgency;
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
    const urgencyStyles: Record<ReportUrgency, {className: string, icon: React.ReactNode}> = {
        'High': {
            className: "bg-[#B60000]/20 text-[#B60000] border-[#B60000]/30 dark:bg-[#B60000]/10 dark:text-[#B60000] dark:border-[#B60000]/20",
            icon: <Flame className="h-3 w-3 mr-1" />
        },
        'Medium': {
            className: "bg-[#f18a0c]/20 text-[#df6905] border-[#f18a0c]/30 dark:bg-[#f18a0c]/10 dark:text-[#f18a0c] dark:border-[#f18a0c]/20",
            icon: <AlertTriangle className="h-3 w-3 mr-1" />
        },
        'Low': {
            className: "bg-[#10b981]/20 text-[#0f766e] border-[#10b981]/30 dark:bg-[#10b981]/10 dark:text-[#10b981] dark:border-[#10b981]/20",
            icon: <ShieldCheck className="h-3 w-3 mr-1" />
        },
    };

  const style = urgencyStyles[urgency];

  return <Badge className={`capitalize ${style.className} flex items-center`}>{style.icon}{urgency}</Badge>;
}
