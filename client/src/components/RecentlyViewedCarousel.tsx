import { Link } from "react-router-dom";

const RecentlyViewedCarousel = () => {
  let ids: string[] = [];
  try {
    ids = JSON.parse(localStorage.getItem('buynest_recent') || '[]');
  } catch {}

  if (!ids.length) return <p className="text-sm text-muted-foreground">No recent views yet.</p>;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {ids.map(id => (
        <Link key={id} to={`/products/${id}`} className="min-w-[160px] p-3 rounded border hover:bg-muted/30">
          <div className="aspect-square bg-muted rounded mb-2" />
          <p className="text-sm">Product #{id}</p>
        </Link>
      ))}
    </div>
  );
};

export default RecentlyViewedCarousel;


