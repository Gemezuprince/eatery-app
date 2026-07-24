import { Link } from 'react-router-dom';

function Home() {
  const categories = [
    'Main meals',
    'Protein & sides',
    'Drinks & beverages',
    'Desserts & snacks',
  ];

  return (
    <div className="bg-brand-light">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
          alt="Delicious food spread"
          className="w-full h-80 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Welcome to Savora!
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Satisfy every craving with delicious local and continental meals,
            tasty proteins, refreshing drinks, desserts, and snacks—freshly
            prepared and delivered to your doorstep.
          </p>
        </div>
      </div>

      <div className="p-8 text-center">
        <Link
          to="/menu"
          className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-primary-100"
        >
          Browse Menu
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">
          Explore Our Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/menu?category=${encodeURIComponent(category)}`}
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition"
            >
              <p className="font-semibold text-brand-dark">{category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
