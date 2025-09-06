/**
 * Mock API for courses
 * Demonstrates async/await patterns and simulates real API behavior
 *
 * In a real application, this would be replaced with actual API calls
 * to a backend service. This mock demonstrates:
 * 1. Promise-based async operations
 * 2. Error handling patterns
 * 3. Network delay simulation
 */

// Sample courses data matching the assignment requirements
const COURSES_DATA = [
  { id: 1, name: "HTML Basics" },
  { id: 2, name: "CSS Mastery" },
  { id: 3, name: "JavaScript Pro" },
  { id: 4, name: "React In Depth" },
]

/**
 * Simulates fetching courses from an external API
 *
 * This function demonstrates:
 * - async/await syntax
 * - Promise creation and resolution
 * - Error simulation for testing error handling
 * - setTimeout usage (demonstrates event loop - non-blocking operation)
 */
export const mockCoursesAPI = {
  async getCourses() {
    // Simulate network delay using setTimeout
    // This demonstrates the event loop: setTimeout is non-blocking
    // The function execution continues after the Promise resolves
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("[v0] Mock API: Courses data fetched after delay")
        resolve(undefined)
      }, 800)
    })

    // Simulate occasional API failures for error handling demonstration
    if (Math.random() < 0.1) {
      // 10% chance of failure
      throw new Error("Network error: Unable to fetch courses")
    }

    // Return a copy of the data to prevent mutations
    return [...COURSES_DATA]
  },

  /**
   * Additional mock method for future expansion
   * Demonstrates how you might fetch a single course
   */
  async getCourseById(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const course = COURSES_DATA.find((course) => course.id === id)
    return course || null
  },
}

export const fetchCourses = async () => {
  return await mockCoursesAPI.getCourses()
}

/**
 * Event Loop Demonstration Function
 *
 * This function demonstrates understanding of JavaScript's event loop
 * by showing the order of execution with synchronous code, setTimeout,
 * and Promise-based async operations
 */
export const demonstrateEventLoop = async () => {
  console.log("[v0] 1. Synchronous code - executes immediately")

  // setTimeout - goes to Web APIs, then callback queue
  setTimeout(() => {
    console.log("[v0] 4. setTimeout callback - executes after call stack is clear")
  }, 0)

  // Promise.resolve - goes to microtask queue (higher priority than callback queue)
  Promise.resolve().then(() => {
    console.log("[v0] 3. Promise microtask - executes before setTimeout")
  })

  console.log("[v0] 2. More synchronous code - executes immediately")

  // async/await - also uses microtask queue
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("[v0] 5. Async operation complete")
      resolve(undefined)
    }, 100)
  })

  console.log("[v0] 6. After await - executes when Promise resolves")
}
