export default function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Never Miss a Deal Again
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of smart shoppers and get instant alerts when appliance prices drop. 
          Start saving today!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-6 py-3 rounded-lg text-neutral-900 placeholder-neutral-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
          />
          <button className="w-full sm:w-auto px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-50 transition-colors whitespace-nowrap">
            Get Started Free
          </button>
        </div>
        
        <p className="text-sm text-primary-200 mt-4">
          Free forever. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
} 