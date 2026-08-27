import {
  Home,
  Users,
  Settings,
  ShoppingCart,
  FileText,
  UsersRound,
  UserPlus,
  Building,
  BarChart3,
  BedDouble,
  CalendarRange,
  DollarSign,
  Tags,
  Clock,
  CheckCircle,
  CalendarDays,
  CalendarCheck,
  Utensils,
  Sparkles,
  Plus,
  UserCog,
  IndianRupee,
  ShieldCheck,
  ClipboardList,
  Wrench,
  UserCheck,
  AlertCircle,
  Ticket,
  TicketCheck,
  Monitor,
  Camera,
  Package,
} from "lucide-react";

export type Role = "admin" | "subadmin" | "department";

export type MenuItem = {
  name: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    name: string;
    path?: string;
    icon: React.ElementType;
  }[];
};

export const menus: Record<Role, MenuItem[]> = {
  admin: [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },

  {
    name: "Customers",
    icon: Users,
    children: [
      {
        name: "All Customers",
        icon: Users,
        path: "/dashboard/customers",
      },
      {
        name: "Add Customer",
        icon: UserPlus,
        path: "/dashboard/customers/create",
      },
    ],
  },

  {
    name: "Products",
    icon: Package,
    children: [
      {
        name: "All Products",
        icon: Package,
        path: "/dashboard/products",
      },
      {
        name: "Add Product",
        icon: Plus,
        path: "/dashboard/products/create",
      },
      {
        name: "CCTV & Devices",
        icon: Camera,
        path: "/dashboard/products/cctv",
      },
    ],
  },

  {
    name: "Customer Machines",
    icon: Monitor,
    children: [
      {
        name: "All Machines",
        icon: Monitor,
        path: "/dashboard/machines",
      },
      {
        name: "Register Machine",
        icon: Plus,
        path: "/dashboard/machines/create",
      },
      {
        name: "Warranty",
        icon: ShieldCheck,
        path: "/dashboard/machines/warranty",
      },
    ],
  },

  {
    name: "Service Tickets",
    icon: TicketCheck,
    children: [
      {
        name: "All Tickets",
        icon: Ticket,
        path: "/dashboard/tickets",
      },
      {
        name: "New Tickets",
        icon: AlertCircle,
        path: "/dashboard/tickets/new",
      },
      {
        name: "Assigned",
        icon: UserCheck,
        path: "/dashboard/tickets/assigned",
      },
      {
        name: "In Progress",
        icon: Clock,
        path: "/dashboard/tickets/in-progress",
      },
      {
        name: "Completed",
        icon: CheckCircle,
        path: "/dashboard/tickets/completed",
      },
    ],
  },

  {
    name: "Technicians",
    icon: Wrench,
    children: [
      {
        name: "All Technicians",
        icon: Users,
        path: "/dashboard/technicians",
      },
      {
        name: "Add Technician",
        icon: UserPlus,
        path: "/dashboard/technicians/create",
      },
      {
        name: "Technician Workload",
        icon: ClipboardList,
        path: "/dashboard/technicians/workload",
      },
    ],
  },

  {
    name: "Services",
    icon: Settings,
    children: [
      {
        name: "Free / Warranty",
        icon: ShieldCheck,
        path: "/dashboard/services/free",
      },
      {
        name: "Paid Services",
        icon: IndianRupee,
        path: "/dashboard/services/paid",
      },
    ],
  },

  {
    name: "Reports",
    icon: BarChart3,
    children: [
      {
        name: "Service Reports",
        icon: FileText,
        path: "/dashboard/reports/services",
      },
      {
        name: "Technician Reports",
        icon: FileText,
        path: "/dashboard/reports/technicians",
      },
      {
        name: "Customer Reports",
        icon: FileText,
        path: "/dashboard/reports/customers",
      },
      {
        name: "Revenue Reports",
        icon: FileText,
        path: "/dashboard/reports/revenue",
      },
    ],
  },

  {
    name: "Users & Staff",
    icon: UserCog,
    path: "/dashboard/users",
  },

  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
  ],

  subadmin: [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard/subadmin",
    },
    {
      name: "Users",
      icon: Users,
      children: [
        {
          name: "All Users",
          icon: Users,
          path: "/dashboard/subadmin/users",
        },
      ],
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/subadmin/orders",
    },
  ],

  department: [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard/department",
    },

    {
      name: "Add Agent",
      icon: UserPlus,
      path: "/dashboard/add-agent",
    },

    {
      name: "View Agent Profile",
      icon: UserPlus,
      path: "/dashboard/agent-profile",
    },

    {
      name: "All Agents",
      icon: Users,
      path: "/dashboard/total-agents",
    },

    {
      name: "All Workers",
      icon: UsersRound,
      path: "/dashboard/total-workers",
    },

    {
      name: "All Transactions",
      icon: FileText,
      path: "/dashboard/total-transactions",
    },
  ],
};