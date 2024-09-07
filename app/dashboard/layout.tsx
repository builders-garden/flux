"use client";

import { shortenAddress } from "@/lib/utils";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import {
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  LogOutIcon,
  PackageSearchIcon,
  Repeat2Icon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Balances",
    href: "/dashboard/balances",
    icon: <CreditCardIcon />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <Repeat2Icon />,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: <Users2Icon />,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: <PackageSearchIcon />,
  },
  {
    label: "Links",
    href: "/dashboard/links",
    icon: <LinkIcon />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = usePrivy();
  const { logout } = useLogout({
    onSuccess: () => router.replace("/"),
  });

  if (!user || !user.wallet) {
    return (
      <section>
        <div className="flex flex-row justify-between p-4">
          <h1 className="text-xl font-bold">Flux</h1>
          <Skeleton className="flex w-36 h-10 rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <div className="flex flex-row justify-between p-4">
        <h1 className="text-xl font-bold">Flux</h1>
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary">
              {shortenAddress(user?.wallet?.address)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              startContent={<CogIcon />}
              as={Link}
              href="/dashboard/settings"
              key="settings"
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onClick={() => logout()}
              startContent={<LogOutIcon />}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="p-4 flex flex-row space-x-8 w-full h-full">
        <nav className="flex flex-col space-y-2 max-w-[200px] flex-shrink-0 border-r-1 pr-8 min-h-full">
          {menuItems.map((menuItem) => (
            <Button
              color="primary"
              variant={pathname === menuItem.href ? "solid" : "light"}
              key={menuItem.href}
              as={Link}
              href={menuItem.href}
              endContent={menuItem.icon}
              className="text-start items-center justify-between"
            >
              {menuItem.label}
            </Button>
          ))}
        </nav>
        <main className="w-full">{children}</main>
      </div>
    </section>
  );
}
