import {
  Home,
  Users,
  Settings,
  ShoppingCart,
  FileText,
  UserPlus,
  BarChart3,
  Clock,
  CheckCircle,
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
  Compass,
  Building,
  List,
  Sparkles,
  DoorOpen,
  BedDouble,
  Hotel,
  Building2,
  MapPin,
  Globe,
  Calendar,
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
      name: "Home",
      icon: Home,
      path: "/dashboard/admin",
    },

    {
      name: "Locations",
      icon: MapPin,
      children: [
        {
          name: "Countries",
          icon: Globe,
          path: "/dashboard/add-country",
        },
        {
          name: "States",
          icon: MapPin,
          path: "/dashboard/add-state",
        },
        {
          name: "Cities",
          icon: Building2,
          path: "/dashboard/add-city",
        },
      ],
    },

    {
      name: "Properties",
      icon: Hotel,
      children: [
        {
          name: "Add Properties",
          icon: Hotel,
          path: "/dashboard/add-property",
        },
        {
          name: "Room Types",
          icon: BedDouble,
          path: "/dashboard/add-room-type",
        },
        {
          name: "Rooms",
          icon: DoorOpen,
          path: "/dashboard/add-room",
        },
      ],
    },

    {
      name: "Amenities",
      icon: Sparkles,
      children: [
        {
          name: "Add Amenities",
          icon: List,
          path: "/dashboard/add-amenity",
        },
        {
          name: "Amenities",
          icon: List,
          path: "/dashboard/amenities",
        },
      ],
    },

    {
      name: "Setup",
      icon: Settings,
      children: [
        {
          name: "Assign Amenities to Property",
          icon: List,
          path: "/dashboard/assign-property-amenities",
        },
        {
          name: "Assign Amenities to Room Type",
          icon: List,
          path: "/dashboard/assign-room-type-amenities",
        },
          {
      name: "Add Room Configuration",
      icon: Settings,
      path: "/dashboard/add-room-configuration",
    },
      ],
    },

    {
      name: "Bookings",
      icon: Calendar,
      path: "/dashboard/admin/bookings",
    },

    {
      name: "Activities",
      icon: Compass,
      path: "/dashboard/admin/activities",
    },
    {
    name: "Team",
    icon: Users,
    children: [
      {
        name: "Add Team",
        icon: Users,
        path: "/dashboard/add-team",
      },
      {
        name: "Team Types",
        icon: UserCog,
        path: "/dashboard/admin/team-types",
      },
    ],
  },
  ],

  department: [
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
};
