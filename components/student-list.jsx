"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Mail, Calendar } from "lucide-react"

/**
 * StudentList Component Props:
 * @typedef {Object} StudentListProps
 * @property {Student[]} students - Array of students to display
 * @property {Course[]} courses - Array of available courses
 * @property {Function} onEdit - Callback when edit button is clicked
 * @property {Function} onDelete - Callback when delete button is clicked
 */

/**
 * StudentList Component
 *
 * Displays a responsive grid of student cards with their information.
 * Demonstrates:
 * 1. Component composition and props
 * 2. Array mapping and key props
 * 3. Conditional rendering
 * 4. Event handling with callbacks
 * 5. Responsive design with Tailwind CSS
 */
function StudentList({ students, courses, onEdit, onDelete }) {
  // Helper function to get course name by ID
  // Demonstrates array methods and optional chaining
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.name || "Unknown Course"
  }

  // Helper function to get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (students.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="font-heading text-xl mb-2">No students found</CardTitle>
          <CardDescription className="text-base">
            Try adjusting your search or filter criteria, or add a new student to get started.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student, index) => (
        <Card
          key={student.id}
          className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="font-heading text-lg leading-tight">{student.name}</CardTitle>
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {getCourseName(student.courseId)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{student.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Enrolled {formatDate(student.createdAt)}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(student)}
                className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(student.id)}
                className="flex-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StudentList
