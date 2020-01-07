// Export native Promise
module.exports = typeof window !== 'undefined' && window.Promise || Promise;
