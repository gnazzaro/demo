import { LibrarySidebar } from "@/components/LibrarySidebar/LibrarySidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * This layout lives inside an outer layout that already renders a fixed/sticky
 * navbar (assumed height: 3.5rem / 56px via the Tailwind `h-14` token).
 *
 * To prevent the floating sidebar from sliding under the navbar we:
 *  1. Make the wrapper fill only the remaining viewport height below the navbar
 *     using `h-[calc(100svh-3.5rem)]` and `mt-14`.
 *  2. Keep `overflow-hidden` so the sidebar stays clipped inside this area.
 *
 * If your navbar height differs, change both `mt-14` and the `calc` value to
 * match (e.g. `mt-16` + `calc(100svh-4rem)` for a 4rem navbar).
 */
export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      {/*
       * `mt-14`  → pushes the entire sidebar region below the 3.5rem navbar.
       * `h-[calc(100svh-3.5rem)]` → constrains the sidebar height so it never
       *   extends behind the navbar or below the viewport.
       */}
      <div className="mt-14 flex h-[calc(100svh-3.5rem)] overflow-hidden">
        <SidebarProvider>
          <LibrarySidebar />

          <SidebarInset>
            {/* Trigger placed inside the inset area, not in a separate <header> */}
            <div className="flex items-center h-10 px-4 shrink-0">
              <SidebarTrigger />
            </div>

            <main className="flex-1 overflow-auto p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
