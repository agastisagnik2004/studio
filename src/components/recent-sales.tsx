import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { sales } from "@/lib/data"

export function RecentSales() {
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div className="flex items-center" key={sale.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.customerAvatar} alt="Avatar" />
            <AvatarFallback>{sale.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {sale.itemName}
            </p>
          </div>
          <div className="ml-auto font-medium">+₹{sale.total.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
