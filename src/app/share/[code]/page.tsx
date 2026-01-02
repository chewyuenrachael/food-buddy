import { redirect } from 'next/navigation';
import { getListByShareCode } from '@/lib/mock-data';

interface SharePageProps {
  params: Promise<{ code: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;
  
  // Look up the list by share code
  const list = getListByShareCode(code);

  if (!list) {
    // Show 404 page
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">List not found</h1>
          <p className="mt-2 text-gray-600">
            This share link may have expired or been deleted.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-orange-500 hover:underline"
          >
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  // Redirect to the full list page
  redirect(`/lists/${list.id}`);
}

export async function generateMetadata({ params }: SharePageProps) {
  const { code } = await params;
  const list = getListByShareCode(code);

  if (!list) {
    return {
      title: 'List not found - Food Buddy',
    };
  }

  return {
    title: `${list.title} - Food Buddy`,
    description: list.description || `Check out this food list with ${list.placeCount} places`,
    openGraph: {
      title: list.title,
      description: list.description || `Check out this food list with ${list.placeCount} places`,
      images: list.coverImageUrl ? [list.coverImageUrl] : [],
    },
  };
}
