import Image from "next/image";
import bgImg from "@/public/halo.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedBackground from "@/components/AnimatedBackground";
import { AppProvider } from "@/contexts/AppContext";
import Sidebar, { SidebarToggle } from "@/components/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <AnimatedBackground />
        <div className="absolute inset-0 dark:bg-dark-radial" />
        <div className="absolute inset-x-0 flex justify-center">
          <Image
            src={bgImg}
            alt=""
            className="w-full max-w-[1200px] mix-blend-screen dark:mix-blend-plus-lighter dark:opacity-10"
            priority
          />
        </div>

        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <div className="isolate relative flex-1 flex flex-col">
              <SidebarToggle />
              <div className="flex-1 flex flex-col">
                <div className="fixed right-4 top-4 z-50">
                  <ThemeToggle />
                </div>
                <Header />
                <div className="flex-1 flex flex-col">
                  {children}
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}