"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, GraduationCap, TrendingUp, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import StudentList from "@/components/student-list"
import StudentForm from "@/components/student-form"
import { fetchCourses } from "@/lib/mock-api"

/**
 * Student object structure:
 * @typedef {Object} Student
 * @property {string} id - Unique identifier
 * @property {string} name - Student's full name
 * @property {string} email - Student's email address
 * @property {number} courseId - ID of enrolled course
 * @property {string} [profileImage] - Optional profile image URL
 * @property {Date} createdAt - Enrollment date
 */

/**
 * Course object structure:
 * @typedef {Object} Course
 * @property {number} id - Unique course identifier
 * @property {string} name - Course name
 */

/**
 * Main Student Management Dashboard Component
 *
 * This component demonstrates several key React and JavaScript concepts:
 * 1. State management with useState hook
 * 2. Side effects with useEffect hook
 * 3. Performance optimization with useMemo hook
 * 4. Async/await for API calls
 * 5. Event loop understanding through setTimeout demonstrations
 */
export default function StudentDashboard() {
  const [students, setStudents] = useState([
    {
      id: "1",
      name: "Rajesh Patil",
      email: "rajesh.patil@gmail.com",
      courseId: 1,
      profileImage: "/professional-man.png",
      createdAt: new Date("2025-01-15"),
    },
    {
      id: "2",
      name: "Om Patel",
      email: "om.patel@gmail.com",
      courseId: 2,
      profileImage: "/professional-man.png",
      createdAt: new Date("2025-02-20"),
    },
    {
      id: "3",
      name: "Ansh Bari",
      email: "ansh.bari@gmail.com",
      courseId: 1,
      profileImage: "/professional-man.png",
      createdAt: new Date("2025-03-10"),
    },
  ])

  const [courses, setCourses] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate network delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 800))

      const coursesData = await fetchCourses()
      setCourses(coursesData)
    } catch (err) {
      setError("Failed to load courses. Please try again.")
      console.error("Error loading courses:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCourse = selectedCourse === "all" || student.courseId.toString() === selectedCourse
      return matchesSearch && matchesCourse
    })
  }, [students, searchTerm, selectedCourse])

  const dashboardStats = useMemo(() => {
    const totalStudents = students.length
    const totalCourses = courses.length
    const recentEnrollments = students.filter(
      (student) => new Date() - new Date(student.createdAt) < 30 * 24 * 60 * 60 * 1000,
    ).length

    return {
      totalStudents,
      totalCourses,
      recentEnrollments,
      averagePerCourse: totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0,
    }
  }, [students, courses])

  // Event handlers for student operations
  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    setStudents((prev) => [...prev, newStudent])
    setIsFormOpen(false)
  }

  const handleEditStudent = (studentData) => {
    if (!editingStudent) return

    setStudents((prev) =>
      prev.map((student) => (student.id === editingStudent.id ? { ...student, ...studentData } : student)),
    )
    setEditingStudent(null)
    setIsFormOpen(false)
  }

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId))
  }

  const openEditForm = (student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  const openAddForm = () => {
    setEditingStudent(null)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Card className="w-full max-w-md animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive font-heading">Connection Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={loadCourses} className="w-full" disabled={loading}>
              {loading ? "Retrying..." : "Retry Loading"}
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="bg-gradient-to-r from-primary via-primary/90 to-secondary shadow-lg border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-black text-primary-foreground tracking-tight">
                Student Management
              </h1>
              <p className="text-primary-foreground/80 text-lg font-medium">
                Manage your students with ease and efficiency
              </p>
            </div>
            <Button
              onClick={openAddForm}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Students
              </CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-black text-foreground">{dashboardStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Active enrollments</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Available Courses
              </CardTitle>
              <BookOpen className="h-6 w-6 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-black text-foreground">{dashboardStats.totalCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Course offerings</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Enrollments
              </CardTitle>
              <TrendingUp className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-black text-foreground">{dashboardStats.recentEnrollments}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Avg per Course
              </CardTitle>
              <GraduationCap className="h-6 w-6 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-black text-foreground">{dashboardStats.averagePerCourse}</div>
              <p className="text-xs text-muted-foreground mt-1">Students enrolled</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-heading font-bold text-foreground">Student Directory</h2>
              <p className="text-muted-foreground">
                {filteredStudents.length} of {students.length} students
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-card border-border/50 focus:border-primary transition-colors"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-card border border-border/50 rounded-md text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <StudentList
              students={filteredStudents}
              courses={courses}
              onEdit={openEditForm}
              onDelete={handleDeleteStudent}
            />
          </div>
        </section>

        {/* Student Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="animate-slide-up">
              <StudentForm
                student={editingStudent}
                courses={courses}
                onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingStudent(null)
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
