function App() {
  return (
    <div className="bg-brand-light min-h-screen p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">
          Savora
        </h2>
      </header>

      <h1 className="text-3xl font-bold text-brand-dark mb-4">
        Welcome to Savora!
      </h1>

      <p className="text-brand-dark-200 text-lg mb-6 max-w-2xl">
        Satisfy every craving with delicious local and continental meals,
        tasty proteins, refreshing drinks, desserts, and snacks—freshly
        prepared and delivered to your doorstep. Order with ease, enjoy
        every bite!
      </p>

      <div className="flex gap-4">
        <button className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold">
          Order Now
        </button>
        <button className="border-2 border-brand-primary text-brand-primary px-6 py-3 rounded-lg font-semibold">
          Add to Cart
        </button>
      </div>

      <div className="mt-6 bg-brand-secondary-400 text-brand-secondary p-4 rounded-lg font-semibold w-fit">
        ✓ Order placed successfully!
      </div>
    </div>
  )
}

export default App
