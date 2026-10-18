import { Footer, Hero, ImagerySection, ColorSection, LogoSection, Nav, PackagingSection, ScrollProgress, Ticker, TypeSection } from "../components/brand/sections";
import { InUseSection } from "../components/brand/in-use";

function Index() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Nav />
      <Hero />
      <Ticker />
      <LogoSection />
      <ColorSection />
      <TypeSection />
      <ImagerySection />
      <PackagingSection />
      <InUseSection />
      <Footer />
    </div>
  );
}

export default Index;
