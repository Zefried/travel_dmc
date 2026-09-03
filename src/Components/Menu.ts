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
  FileBarChart,
  CreditCard,
  Star,
  Target,
  TrendingUp,
  HardDrive,
  Boxes,
  Briefcase,
  MessageSquare,
  Store,
  Car,
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
          name: "View States",
          icon: MapPin,
          path: "/dashboard/states",
        },
        {
          name: "Cities",
          icon: Building2,
          path: "/dashboard/add-city",
        },
        {
          name: "View Cities",
          icon: Building2,
          path: "/dashboard/cities",
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
          name: "View Properties",
          icon: Hotel,
          path: "/dashboard/properties",
        },
        {
          name: "Room Types",
          icon: BedDouble,
          path: "/dashboard/add-room-type",
        },
        {
          name: "View Room Types",
          icon: BedDouble,
          path: "/dashboard/room-types",
        },
        {
          name: "Rooms",
          icon: DoorOpen,
          path: "/dashboard/add-room",
        },
        {
          name: "View Rooms",
          icon: DoorOpen,
          path: "/dashboard/rooms",
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
    name: "Vehicles",
      icon: Car,
        children: [
            {
                name: "Add Vehicle",
                icon: Plus,
                path: "/dashboard/add-vehicle",
            },
            {
                name: "View Vehicles",
                icon: List,
                path: "/dashboard/view-vehicles",
            },
        ],
    },

    {
      name: "Setup",
      icon: Settings,
      children: [
          {
              name: "Property Amenities",
              icon: List,
              path: "/dashboard/assign-property-amenities",
          },
          {
              name: "Room Amenities",
              icon: List,
              path: "/dashboard/assign-room-type-amenities",
          },
          {
              name: "Room Configuration",
              icon: Settings,
              path: "/dashboard/add-room-configuration",
          },
          {
              name: "Meal Config",
              icon: Settings,
              path: "/dashboard/view-meal-config",
          },
          {
              name: "Bed Config",
              icon: Settings,
              path: "/dashboard/view-bed-config",
          },
      ],
    },

    {
      name: "Bookings",
      icon: Calendar,
      path: "/dashboard/admin/bookings",
    },


   
  ],


  // admin:[
  // {
  //   name: "Home",
  //   icon: Home,
  //   path: "/dashboard/admin",
  // },

  // {
  //   name: "Businesses",
  //   icon: Building2,
  //   children: [
  //     {
  //       name: "Businesses",
  //       icon: Store,
  //       path: "/dashboard/admin/businesses",
  //     },
  //     {
  //       name: "Pending Approval",
  //       icon: Clock,
  //       path: "/dashboard/admin/businesses/pending",
  //     },
  //     {
  //       name: "Categories",
  //       icon: List,
  //       path: "/dashboard/admin/business-categories",
  //     },
  //   ],
  // },

  // {
  //   name: "Locations",
  //   icon: MapPin,
  //   children: [
  //     {
  //       name: "Countries",
  //       icon: Globe,
  //       path: "/dashboard/add-country",
  //     },
  //     {
  //       name: "States",
  //       icon: MapPin,
  //       path: "/dashboard/add-state",
  //     },
  //     {
  //       name: "Cities",
  //       icon: Building2,
  //       path: "/dashboard/add-city",
  //     },
  //   ],
  // },

  // {
  //   name: "Services",
  //   icon: Camera,
  //   children: [
  //     {
  //       name: "Services",
  //       icon: List,
  //       path: "/dashboard/admin/services",
  //     },
  //     {
  //       name: "Service Types",
  //       icon: Settings,
  //       path: "/dashboard/admin/service-types",
  //     },
  //   ],
  // },

  // {
  //   name: "Leads",
  //   icon: UserPlus,
  //   children: [
  //     {
  //       name: "All Leads",
  //       icon: Users,
  //       path: "/dashboard/admin/leads",
  //     },
  //     {
  //       name: "New Leads",
  //       icon: Sparkles,
  //       path: "/dashboard/admin/leads/new",
  //     },
  //     {
  //       name: "Assigned Leads",
  //       icon: UserCheck,
  //       path: "/dashboard/admin/leads/assigned",
  //     },
  //     {
  //       name: "Converted Leads",
  //       icon: CheckCircle,
  //       path: "/dashboard/admin/leads/converted",
  //     },
  //   ],
  // },

  // {
  //   name: "Customers",
  //   icon: Users,
  //   children: [
  //     {
  //       name: "Customers",
  //       icon: Users,
  //       path: "/dashboard/admin/customers",
  //     },
  //     {
  //       name: "Requests",
  //       icon: MessageSquare,
  //       path: "/dashboard/admin/customer-requests",
  //     },
  //   ],
  // },

  // {
  //   name: "Jobs",
  //   icon: Briefcase,
  //   children: [
  //     {
  //       name: "Installations",
  //       icon: Camera,
  //       path: "/dashboard/admin/jobs/installations",
  //     },
  //     {
  //       name: "Maintenance",
  //       icon: Wrench,
  //       path: "/dashboard/admin/jobs/maintenance",
  //     },
  //     {
  //       name: "Service Requests",
  //       icon: ClipboardList,
  //       path: "/dashboard/admin/jobs/service-requests",
  //     },
  //   ],
  // },

  // {
  //   name: "Products",
  //   icon: Package,
  //   children: [
  //     {
  //       name: "Cameras",
  //       icon: Camera,
  //       path: "/dashboard/admin/products/cameras",
  //     },
  //     {
  //       name: "DVR / NVR",
  //       icon: Monitor,
  //       path: "/dashboard/admin/products/dvr-nvr",
  //     },
  //     {
  //       name: "Storage",
  //       icon: HardDrive,
  //       path: "/dashboard/admin/products/storage",
  //     },
  //     {
  //       name: "Accessories",
  //       icon: Boxes,
  //       path: "/dashboard/admin/products/accessories",
  //     },
  //   ],
  // },

  // {
  //   name: "Performance",
  //   icon: BarChart3,
  //   children: [
  //     {
  //       name: "Business Performance",
  //       icon: TrendingUp,
  //       path: "/dashboard/admin/business-performance",
  //     },
  //     {
  //       name: "Lead Performance",
  //       icon: Target,
  //       path: "/dashboard/admin/lead-performance",
  //     },
  //     {
  //       name: "Response Time",
  //       icon: Clock,
  //       path: "/dashboard/admin/response-time",
  //     },
  //     {
  //       name: "Customer Satisfaction",
  //       icon: Star,
  //       path: "/dashboard/admin/customer-satisfaction",
  //     },
  //   ],
  // },

  // {
  //   name: "Reviews",
  //   icon: Star,
  //   path: "/dashboard/admin/reviews",
  // },

  // {
  //   name: "Subscriptions",
  //   icon: CreditCard,
  //   children: [
  //     {
  //       name: "Plans",
  //       icon: Package,
  //       path: "/dashboard/admin/plans",
  //     },
  //     {
  //       name: "Subscriptions",
  //       icon: CreditCard,
  //       path: "/dashboard/admin/subscriptions",
  //     },
  //   ],
  // },

  // {
  //   name: "Team",
  //   icon: Users,
  //   children: [
  //     {
  //       name: "Staff",
  //       icon: Users,
  //       path: "/dashboard/admin/team",
  //     },
  //     {
  //       name: "Roles",
  //       icon: UserCog,
  //       path: "/dashboard/admin/roles",
  //     },
  //   ],
  // },

  // {
  //   name: "Reports",
  //   icon: FileBarChart,
  //   path: "/dashboard/admin/reports",
  // },

  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/dashboard/admin/settings",
  // },
  // ],
  
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
