export const getAllCourses = async () => {
  try {
    const response = await fetch("http://localhost:8070/api/courses");
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};
