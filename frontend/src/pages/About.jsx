function About() {
  const features = [
    { emoji: '🍽️', text: 'Freshly prepared meals' },
    { emoji: '🚚', text: 'Fast and reliable delivery' },
    { emoji: '🥗', text: 'Quality ingredients' },
    { emoji: '💳', text: 'Secure online payments' },
    { emoji: '⭐', text: 'Excellent customer service' },
  ];

  return (
    <div className="bg-brand-light min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-6">About Savora</h1>

        <p className="text-brand-dark-200 text-lg leading-relaxed">
          Welcome to Savora, where every meal is prepared with care and
          delivered fresh to your doorstep. We offer a wide selection of
          delicious local and continental dishes, proteins, drinks, desserts,
          and snacks made from quality ingredients.
        </p>

        <p className="text-brand-dark-200 text-lg leading-relaxed mt-4">
          Our mission is to make food ordering simple, fast, and enjoyable
          while ensuring every customer receives excellent service and great
          value.
        </p>

        <h2 className="text-2xl font-bold text-brand-dark mt-10 mb-4">
          Why Choose Savora?
        </h2>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature.text} className="flex items-center gap-3 text-brand-dark-200 text-lg">
              <span className="text-2xl">{feature.emoji}</span>
              {feature.text}
            </li>
          ))}
        </ul>

        <div className="bg-white rounded-lg shadow p-6 mt-10">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Our Vision</h2>
          <p className="text-brand-dark-200 text-lg leading-relaxed">
            To become the preferred online food delivery platform known for
            quality, convenience, and customer satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
