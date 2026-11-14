import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb-trail breadcrumbs">
      <ul className="trail-items breadcrumb">
        <li className="trail-item trail-begin">
          <Link href="/">
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={item.label}
              className={`trail-item ${isLast ? "trail-end active" : ""}`}
            >
              {item.href && !isLast ? (
                <Link href={item.href}>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
