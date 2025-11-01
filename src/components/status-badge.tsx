import { Badge } from "@/components/ui/badge"
import type { ReportStatus } from "@/lib/types"

type StatusBadgeProps = {
  status: ReportStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<ReportStatus, string> = {
    'For Review': "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800",
    'In Progress': "bg-[#f18a0c]/20 text-[#df6905] border-[#f18a0c]/30 dark:bg-[#f18a0c]/10 dark:text-[#f18a0c] dark:border-[#f18a0c]/20",
    'Resolved': "bg-[#1a7d04]/20 text-[#134504] border-[#1a7d04]/30 dark:bg-[#1a7d04]/10 dark:text-[#1a7d04] dark:border-[#1a7d04]/20",
  };

  return <Badge className={`capitalize ${statusStyles[status]}`}>{status}</Badge>;
}
