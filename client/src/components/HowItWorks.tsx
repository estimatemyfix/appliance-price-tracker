export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Search & Discover',
      description: 'Search for any appliance by model number, brand, or category. Browse thousands of products from major retailers.',
      icon: '🔍'
    },
    {
      number: 2,
      title: 'Track Prices',
      description: 'Set up price alerts for products you want. We monitor prices 24/7 across all major retailers.',
      icon: '📊'
    },
    {
      number: 3,
      title: 'Get Smart Alerts',
      description: 'Receive instant notifications when prices drop or deals become available. AI tells you the best time to buy.',
      icon: '🔔'
    },
    {
      number: 4,
      title: 'Save Money',
      description: 'Purchase at the lowest price with confidence. Use our affiliate links to support the platform.',
      icon: '💰'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Start saving on appliances in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-neutral-200 transform -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10 bg-white">
                {/* Icon circle */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg">
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/register" className="btn btn-primary btn-lg">
            Start Tracking Prices
          </a>
        </div>
      </div>
    </section>
  );
} 