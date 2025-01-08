export function shuffleArray(array) {
    // First, check if we have a valid array
    if (!Array.isArray(array) || array.length === 0) {
      console.warn('shuffleArray received invalid input:', array);
      return array;
    }
  
    // Create a copy of the array to avoid mutating the original
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  
    console.log('Original array length:', array.length);
    console.log('Shuffled array length:', shuffled.length);
    
    return shuffled;
  }