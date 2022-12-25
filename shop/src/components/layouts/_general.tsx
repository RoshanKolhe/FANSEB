import Header from './header';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';

export default function GeneralLayout({
  children,
  layout,
}: React.PropsWithChildren<{ layout?: any }>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      <HeaderMinimal layout={layout} />
      {children}
      <MobileNavigation />
    </div>
  );
}

export const getGeneralLayout = (page: React.ReactElement) => (
  <GeneralLayout layout={page.props.layout}>
    {page}
    <MobileNavigation />
  </GeneralLayout>
);
